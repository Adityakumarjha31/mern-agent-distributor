import multer from "multer";
import { parse } from "csv-parse/sync";
import XLSX from "xlsx";
import fs from "fs";
import Agent from "../models/Agent.js";
import ListItem from "../models/ListItem.js";

// ---------------- Multer Configuration ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});

export const upload = multer({ storage });

// ---------------- Upload and Distribute List ----------------
export const uploadList = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    let items = [];

    if (req.file.mimetype.includes("csv")) {
      const fileContent = fs.readFileSync(req.file.path);
      const records = parse(fileContent, { columns: true, trim: true });
      items = records.map((r) => ({
        firstName: r.FirstName?.trim(),
        phone: r.Phone?.trim(),
        notes: r.Notes?.trim() || "",
      }));
    } else if (
      req.file.mimetype.includes("sheet") ||
      req.file.mimetype.includes("excel")
    ) {
      const workbook = XLSX.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      items = sheet.map((r) => ({
        firstName: r.FirstName?.trim(),
        phone: r.Phone?.trim(),
        notes: r.Notes?.trim() || "",
      }));
    } else {
      return res.status(400).json({
        message: "Invalid file type. Please upload CSV or Excel file.",
      });
    }

    if (items.length === 0)
      return res.status(400).json({
        message: "Uploaded file is empty or invalid format.",
      });

    const agents = await Agent.find();
    if (agents.length === 0)
      return res
        .status(400)
        .json({ message: "No agents available for distribution." });

    const distributed = items.map((item, i) => ({
      ...item,
      assignedTo: agents[i % agents.length]._id,
    }));

    const saved = await ListItem.insertMany(distributed);

    const populated = await ListItem.find({
      _id: { $in: saved.map((s) => s._id) },
    }).populate("assignedTo", "name email phone");

    res.json({
      message: "✅ List uploaded and distributed successfully",
      total: populated.length,
      data: populated,
    });
  } catch (err) {
    console.error("❌ Upload Error:", err);
    res.status(500).json({ message: err.message });
  } finally {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
};

// ---------------- Get Agent-Specific Leads ----------------
export const getAgentLeads = async (req, res) => {
  try {
    const agentId = req.params.id;
    const leads = await ListItem.find({ assignedTo: agentId }).populate(
      "assignedTo",
      "name email phone"
    );

    res.json({
      message: `Leads for agent ${agentId}`,
      total: leads.length,
      data: leads,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
