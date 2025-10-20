import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js"; // ✅ NEW

dotenv.config();

const app = express();

// ---------------- Middlewares ----------------
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend URL
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------- MongoDB Connection ----------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  });

// ---------------- Routes ----------------
app.use("/api/auth", authRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/leads", listRoutes);
app.use("/api/upload", uploadRoutes); // ✅ NEW upload route

// ---------------- Test Route ----------------
app.get("/", (req, res) => {
  res.send("Server is running and MongoDB is connected ✅");
});

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
