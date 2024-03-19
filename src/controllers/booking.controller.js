import nodemailer from "nodemailer";
import { Booking } from "../models/booking.model.js";
import errorHandler from "../utils/errorHandler.js";
import responseHandler from "../utils/responseHandler.js";

const sendBookingDetails = async (req, res) => {
  const {
    trainerName,
    customerName,
    customerEmail,
    trainerEmail,
    modeOfTraining,
    workoutType,
    date,
    timeSlots,
    amount,
  } = req.body;
  const { startTime, endTime } = timeSlots[0];

  try {
    // Send an email with the booking details
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "dumbbelldoor.service@gmail.com",
        pass: "pwfs oklw nhtf nnmz",
      },
    });

    const mailOptions = {
      from: ' "Dumbbell Door" <dumbbelldoor.service@gmail.com>',
      to: customerEmail,
      subject: "Booking requested!",
      html: `<div> 
      <p>Hi <b>${customerName}</b>, your recent training request on Dumbbell Door has been sent to <b>${trainerName}</b> for confirmation. You will receive a confirmation mail once the request is approved from your trainer's end. Below are your booking details,</p>
        <ul>
          <li>Trainer Name : ${trainerName}</li>
          <li>Mode of Training : ${modeOfTraining}</li>
          <li>Workout Type : ${workoutType}</li>
          <li>Booking Date : ${date}</li>
          <li>Start Time : ${startTime}:00 Hours</li>
          <li>End Time : ${endTime}:00 Hours</li>
          <li>Amount Paid : Rs. ${amount}</li>
        </ul>
        <p>Regards,</p>
        <p><b>Dumbbell Door</b></p> 
      </div>`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log(error);
        return errorHandler(res, 500, "Error sending email");
      } else {
        try {
          // console.log("Email sent: " + info.response);
          // const date = new Date();
          // const formattedDate = `${date.getDate()}/${
          //   date.getMonth() + 1
          // }/${date.getFullYear()}`;
          await Booking.create({
            date,
            customerEmail,
            customerName,
            trainerEmail,
            trainerName,
            workoutType,
            modeOfTraining,
            timeSlots,
            bookingStatus: "Requested",
            amount,
          });
          return responseHandler(
            res,
            200,
            "Request confirmed, please check your mail for booking details!"
          );
        } catch (error) {
          console.error(error);
          return errorHandler(res, 500, error.message);
        }
      }
    });
  } catch (error) {
    console.error(error);
    return errorHandler(res, 500, error.message);
  }
};

const updateBookingDetails = async (req, res) => {
  const {
    customerId,
    trainerId,
    customerName,
    trainerName,
    customerEmail,
    trainerEmail,
    modeOfTraining,
    workoutType,
    date,
    timeSlots,
    amount,
  } = req.body;
  const { startTime, endTime } = timeSlots[0];
  const { bookingId } = req.params;

  try {
    // Send an email with the booking details
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "dumbbelldoor.service@gmail.com",
        pass: "pwfs oklw nhtf nnmz",
      },
    });

    const mailOptions = {
      from: ' "Dumbbell Door" <dumbbelldoor.service@gmail.com>',
      to: customerEmail,
      subject: "Revised booking details!",
      html: `<div> 
      <p>Hi <b>${customerName}</b>, below are your updated booking details,</p>
        <ul>
          <li>Trainer Name : ${trainerName}</li>
          <li>Mode of Training : ${modeOfTraining}</li>
          <li>Workout Type : ${workoutType}</li>
          <li>Booking Date : ${date}</li>
          <li>Start Time : ${startTime}:00 Hours</li>
          <li>End Time : ${endTime}:00 Hours</li>
          <li>Amount Paid : ${amount}</li>
        </ul>
        <p>Regards,</p>
        <p><b>Dumbbell Door</b></p> 
      </div>`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log(error);
        return errorHandler(res, 500, "Error sending email");
      } else {
        try {
          // console.log("Email sent: " + info.response);
          // const date = new Date();
          // const formattedDate = `${date.getDate()}/${
          //   date.getMonth() + 1
          // }/${date.getFullYear()}`;

          await Booking.updateOne(
            { _id: bookingId },
            {
              date,
              customerId,
              trainerId,
              customerEmail,
              trainerEmail,
              trainerName,
              workoutType,
              modeOfTraining,
              timeSlots,
              bookingStatus: "Requested",
              amount,
            }
          );
          return responseHandler(
            res,
            200,
            "Reschedule confirmed, please check your mail for updated booking details!"
          );
        } catch (error) {
          console.error(error);
          return errorHandler(res, 500, error.message);
        }
      }
    });
  } catch (error) {
    console.error(error);
    return errorHandler(res, 500, error.message);
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { bookingStatus } = req.body;

    const booking = await Booking.findById({ _id: bookingId });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found!" });
    }

    await Booking.updateOne({ _id: bookingId }, { bookingStatus });
    return res
      .status(200)
      .json({ message: "Booking status updated successfully." });
  } catch (error) {
    console.error("Error updating booking status:", error);
    return res.status(500).json({
      error: "Error updating booking status. Please try again later.",
    });
  }
};

const getBookingsByUser = async (req, res) => {
  // try {
  //   let userType;
  //   let userEmail;

  //   // Determine user type based on the presence of cookies
  //   if (req.cookies.customerEmail) {
  //     userType = "customer";
  //     userEmail = req.cookies.customerEmail;
  //   } else if (req.cookies.trainerEmail) {
  //     userType = "trainer";
  //     userEmail = req.cookies.trainerEmail;
  //   } else {
  //     return res.status(400).json({ message: "User type not recognized." });
  //   }

  //   // Fetch bookings based on user type and email
  //   const bookings = await Booking.find({
  //     [`${userType}Email`]: userEmail,
  //   });

  //   res.json(bookings);
  // } catch (error) {
  //   res.status(500).json({ message: error.message });
  // }
  try {
    const { email } = req.params;

    if (!email) {
      return errorHandler(res, 400, "User email is required.");
    }

    // Fetch bookings based on user type and email
    const bookings = await Booking.find({
      customerEmail: email,
    });

    //req.cookies.accessToken;
    //const token = jwt.decode(accessToken);
    //token.email = userEmail;

    return responseHandler(res, 200, bookings);
  } catch (error) {
    return errorHandler(res, 500, error.message);
  }
};

export {
  sendBookingDetails,
  updateBookingDetails,
  updateBookingStatus,
  getBookingsByUser,
};
