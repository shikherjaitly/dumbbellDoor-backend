import express from "express";
import { sendBookingDetails } from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/send-booking-details", sendBookingDetails);

export default router;
