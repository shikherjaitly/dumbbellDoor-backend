import express from "express";
import {
  sendBookingDetails,
  updateBookingDetails,
  updateBookingStatus,
  getCustomerBookings,
  getTrainerBookings,
} from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/send-booking-details", sendBookingDetails);
router.patch("/update-booking-details/:bookingId", updateBookingDetails);
router.patch("/update-booking-status/:bookingId", updateBookingStatus);
router.get("/customer/:email", getCustomerBookings);
router.get("/trainer/:email", getTrainerBookings);

export default router;
