import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const createAdmin = async () => {
  try {
    const admin = new Admin({
      name: "Super Admin",
      email: "admin@example.com",
      password: "admin123",
    });
    await admin.save();
    console.log("✅ Admin created");
    process.exit();
  } catch (err) {
    console.log(err.message);
    process.exit();
  }
};

createAdmin();
