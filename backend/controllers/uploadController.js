import csv from "csv-parser";
import XLSX from "xlsx";

export const handleFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { originalname, buffer } = req.file;
    let data = [];

    // handle CSV
    if (originalname.endsWith(".csv")) {
      const text = buffer.toString("utf8");
      const rows = text.split("\n").map((r) => r.split(","));
      data = rows.map((row) => ({
        name: row[0],
        email: row[1],
        phone: row[2],
      }));
    }

    // handle Excel
    if (originalname.endsWith(".xlsx") || originalname.endsWith(".xls")) {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      data = XLSX.utils.sheet_to_json(sheet);
    }

    console.log("✅ Uploaded Data:", data);

    // TODO: distribute to agents here if needed

    res.json({ message: "File uploaded successfully!", rows: data.length });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Server error during file upload" });
  }
};
