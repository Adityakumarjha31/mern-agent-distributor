// backend/scripts/createOrUpdateAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

dotenv.config();
const MONGO = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/agent_distributor_db";

const run = async () => {
  await mongoose.connect(MONGO);
  const email = "admin@example.com";
  const password = "admin123";
  const hashed = await bcrypt.hash(password, 10);

  const updated = await Admin.findOneAndUpdate(
    { email },
    { $set: { name: "Super Admin", email, password: hashed } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log("Admin upserted:", updated.email, updated._id);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch(e => {
  console.error(e);
  process.exit(1);
});
