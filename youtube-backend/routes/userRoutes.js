import { Router } from "express";
import { signUp, signIn, logout } from "../controllers/userController.js";

const router = Router();

// Auth Routes
router.post("/signUp", signUp);
router.post("/login", signIn);
router.post("/logout", logout);

export default router;
