import express from "express";
import {
  sendBookingDetails,
  updateBookingDetails,
  updateBookingStatus,
} from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/send-booking-details", sendBookingDetails);
router.patch("/update-booking-details/:bookingId", updateBookingDetails);
router.patch("/update-booking-status/:bookingId", updateBookingStatus);

export default router;
