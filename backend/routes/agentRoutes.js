import express from "express";
import {
  addAgent,
  getAgents,
  updateAgent,
  deleteAgent,
  loginAgent,
  getAgentLeads,
} from "../controllers/agentController.js";
import { protectAgent } from "../middleware/authMiddleware.js";

const router = express.Router();

// Agent CRUD
router.post("/", addAgent);
router.get("/", getAgents);
router.put("/:id", updateAgent);
router.delete("/:id", deleteAgent);

// Agent login
router.post("/login", loginAgent);

// Protected route to get leads
router.get("/leads", protectAgent, getAgentLeads);

export default router;
