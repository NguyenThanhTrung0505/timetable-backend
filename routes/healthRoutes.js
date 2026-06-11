import express from "express";
import { checkHealth } from "../controllers/healthController.js";
const router = express.Router();
router.get("/health-check", checkHealth);
export default router;
