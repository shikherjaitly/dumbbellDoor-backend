import express from "express";
import { bookSession } from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/book-session", bookSession);

export default router;