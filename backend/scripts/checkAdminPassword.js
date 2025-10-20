import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js"; // adjust path if needed

const run = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/agent_distributor_db");
    console.log("✅ Connected to MongoDB");

    const admin = await Admin.findOne({ email: "admin@example.com" });
    if (!admin) {
      console.log("❌ Admin not found");
      return process.exit(1);
    }

    console.log("Stored password hash:", admin.password);

    const match = await bcrypt.compare("admin123", admin.password);
    console.log("Password matches?", match);

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
