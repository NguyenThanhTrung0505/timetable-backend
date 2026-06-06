import express from "express";
const router = express.Router();
import {
    getAllEventsController,
    createEventController,
} from "../controllers/eventController.js";
import { protect } from "../middlewares/authMiddleware.js";
router.get("/", protect, getAllEventsController);
router.post("/create-event", protect, createEventController);

export default router;
