import express from "express";
import multer from "multer";
import { gradePronunciation } from "../controllers/pronunciationController.js";

const router = express.Router();
const upload = multer({ dest: 'uploads/temp/' }); // Nơi lưu tạm file

router.post("/grade", upload.single('user_audio'), gradePronunciation);
export default router;