import express from "express";
import multer from "multer";
import { uploadList, getAgentLeads } from "../controllers/listController.js";
import { protectAgent } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer setup for file uploads
const storage = multer.memoryStorage(); // store file in memory
export const upload = multer({ storage });

// ---------------- Routes ----------------

// Upload CSV/XLSX list (protected for agents)
router.post("/upload", protectAgent, upload.single("file"), uploadList);

// Get all leads assigned to the logged-in agent
router.get("/agent/leads", protectAgent, getAgentLeads);

export default router;
