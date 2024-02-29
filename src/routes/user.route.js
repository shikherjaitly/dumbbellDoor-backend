import express from "express";
import {
  forgotPassword,
  login,
  resetPassword,
  signup,
} from "../controllers/authentication.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
//tested
