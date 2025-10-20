import mongoose from "mongoose";

const listItemSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
  },
  { timestamps: true }
);

export default mongoose.model("ListItem", listItemSchema);
