import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    date: { type: Date },
    customerEmail: { type: String },
    trainerEmail: { type: String },
    workoutType: { type: String },
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
        startTime: { type: Number, min: 0, max: 24 },
        endTime: { type: Number, min: 0, max: 24 },
      },
    ],
    amount: { type: String },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
