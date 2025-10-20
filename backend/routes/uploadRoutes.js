import express from "express";
import multer from "multer";
import { handleFileUpload } from "../controllers/uploadController.js";

const router = express.Router();

// configure multer (for file uploads)
const storage = multer.memoryStorage(); // stores file in memory (can use diskStorage if you want)
const upload = multer({ storage });

// route: POST /api/upload
router.post("/", upload.single("file"), handleFileUpload);

export default router;
