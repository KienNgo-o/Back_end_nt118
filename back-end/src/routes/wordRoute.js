// routes/wordRoute.js
import express from "express";
import { getWordDetails, getWordsByTopic } from "../controllers/wordController.js";

const router = express.Router();

// API 3: GET /api/words/:id
router.get("/:id", getWordDetails);
router.get("/:topicId/pronun", getWordsByTopic);

export default router;