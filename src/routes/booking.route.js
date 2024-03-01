import express from "express";
import {
  bookSession,
  sendBookingDetails,
} from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/book-session", bookSession);
router.post("/send-booking-details", sendBookingDetails);

export default router;
