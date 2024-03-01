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
    startTime,
    endTime,
    amount,
  } = req.body;

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
          <li>Start Time : ${startTime}</li>
          <li>End Time : ${endTime}</li>
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
          const date = new Date();
          const formattedDate = `${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`;
          await Booking.create({
            date: formattedDate,
            customerEmail,
            trainerEmail,
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

export { bookSession, sendBookingDetails };
