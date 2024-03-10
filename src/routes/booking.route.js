import express from "express";
import {
  sendBookingDetails,
  updateBookingDetails,
  updateBookingStatus,
  getBookingsByUser,
} from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/send-booking-details", sendBookingDetails);
router.patch("/update-booking-details/:bookingId", updateBookingDetails);
router.patch("/update-booking-status/:bookingId", updateBookingStatus);
router.get("/", getBookingsByUser);
export default router;
