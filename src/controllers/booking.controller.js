import { Booking } from "../models/booking.model.js";
import errorHandler from "../utils/errorHandler.js";
import responseHandler from "../utils/responseHandler.js";

const bookSession = async (req, res) => {
  const {
    date,
    customerEmail,
    trainerEmail,
    workoutType,
    modeOfTraining,
    timeSlots,
  } = req.body;

  try {
    await Booking.create({
      date,
      customerEmail,
      trainerEmail,
      workoutType,
      modeOfTraining,
      timeSlots,
      bookingStatus: "Requested",
    });
    return responseHandler(res, 201, "Booking created successfully!");
  } catch (error) {
    return errorHandler(res, 500, error.message);
  }
};

export { bookSession };
