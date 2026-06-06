import express from "express";
const router = express.Router();
import {
    loginController,
    createNewUserController,
} from "../controllers/authController.js";

router.post("/login", loginController);
router.post("/register", createNewUserController);
export default router;
