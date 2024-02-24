/* Tasks 
    -- define schema for the bookings section
    -- booking id: 22-02-24:{
	   customer name:,
	   time_slots:[11-12,13-14],
    
}
*/

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    customerEmail: { type: String, required: true },
    trainerEmail: { type: String, required: true },
    workoutType: [{ type: String, required: true }],
    modeOfTraining: {
      type: String,
      enum: ["Online", "In-Person"],
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ["Requested", "Completed", "Upcoming"],
    },
    timeSlots: [
      {
        startTime: { type: Number, required: true, min: 0, max: 24 },
        endTime: { type: Number, required: true, min: 0, max: 24 },
      },
    ],
  },
  { timestamps: true }
);

export const bookings = mongoose.model("Bookings", bookingsSchema);
