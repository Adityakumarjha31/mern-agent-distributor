import Agent from "../models/Agent.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ListItem from "../models/ListItem.js"; // ← make sure your model is correct

// Add new agent
export const addAgent = async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existing = await Agent.findOne({ email });
    if (existing) return res.status(400).json({ message: "Agent already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const agent = new Agent({ name, email, phone, password: hashedPassword });
    await agent.save();

    res.status(201).json({ message: "Agent created", agent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all agents
export const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find();
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update agent
export const updateAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: "Agent not found" });

    const { name, email, phone, password } = req.body;
    if (name) agent.name = name;
    if (email) agent.email = email;
    if (phone) agent.phone = phone;
    if (password) agent.password = await bcrypt.hash(password, 10);

    await agent.save();
    res.json({ message: "Agent updated", agent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete agent
export const deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: "Agent not found" });

    await agent.deleteOne();
    res.json({ message: "Agent deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Agent login
export const loginAgent = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const agent = await Agent.findOne({ email });
    if (!agent) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, agent.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: agent._id, role: "agent" }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ _id: agent._id, name: agent.name, email: agent.email, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get leads assigned to agent (protected)
export const getAgentLeads = async (req, res) => {
  try {
    const agentId = req.agent._id;
    const leads = await ListItem.find({ assignedTo: agentId }); // ← use ListItem here
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
