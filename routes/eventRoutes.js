import express from "express";
const router = express.Router();
import {
    getInfoController,
    createEventController,
    getEventInWeekController,
    deleteEventController,
    updateEventController,
} from "../controllers/eventController.js";
import { protect } from "../middlewares/authMiddleware.js";
router.get("/", protect, getInfoController);
router.get("/week", protect, getEventInWeekController);
router.post("/create-event", protect, createEventController);
router.delete("/:id", protect, deleteEventController);
router.put("/update-event/:id", protect, updateEventController);

export default router;
