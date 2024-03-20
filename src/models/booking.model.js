import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    date: { type: String },
    customerId: { type: String },
    trainerId: { type: String },
    customerEmail: { type: String },
    trainerEmail: { type: String },
    trainerName: { type: String },
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
    date: { type: String },
    startTime: { type: Number, min: 0, max: 24 },
    endTime: { type: Number, min: 0, max: 24 },

    amount: { type: String },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
