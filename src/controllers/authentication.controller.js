import emailValidator from "deep-email-validator";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import errorHandler from "../utils/errorHandler.js";
import responseHandler from "../utils/responseHandler.js";
import { Customer } from "../models/customer.model.js";
import { Trainer } from "../models/trainer.model.js";
import { Session } from "../models/session.model.js";
import { ForgotPassword } from "../models/forgotPassword.model.js";

dotenv.config({
  path: "./.env",
});

const signup = async (req, res) => {
  const { email, password, role } = req.body;
  if (!(email && password && role)) {
    return errorHandler(res, 406, "All fields are mandatory!");
  }

  const isEmailValid = async () => {
    return await emailValidator.validate({ email, validateSMTP: false });
  };

  const response = await isEmailValid();

  if (!response.valid) {
    return errorHandler(res, 400, "Please provide a valid email address!");
  }

  try {
    const existingCustomer = await Customer.findOne({ email });
    const existingTrainer = await Trainer.findOne({ email });

    if (existingCustomer || existingTrainer) {
      return errorHandler(
        res,
        400,
        "Email is already registered, please try with a different account!"
      );
    }

    const user = role === "customer" ? Customer : Trainer;
    await user.create({ email, password });
    return responseHandler(res, 200, "Signup successful!");
  } catch (error) {
    return errorHandler(res, 400, "An error occurred: " + error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!(email && password)) {
    return errorHandler(res, 406, "Email & password are mandatory!");
  }

  // Validate email
  const response = await emailValidator.validate({
    email,
    validateSMTP: false,
  });
  if (!response.valid) {
    return errorHandler(res, 400, "Please provide a valid email address!");
  }

  // Check if user is already logged in
  const isActiveUser = await Session.findOne({ email });
  if (isActiveUser) {
    return errorHandler(
      res,
      400,
      "You're already logged in, kindly continue with the session!"
    );
  }

  // Check if user exists
  const user =
    (await Customer.findOne({ email })) || (await Trainer.findOne({ email }));
  if (!user) {
    return errorHandler(res, 400, `User is not registered!`);
  }

  // Validate user credentials
  const validUser = await bcrypt.compare(password, user.password);
  if (validUser) {
    // Generate JWT token and create session
    jwt.sign(
      { email, password },
      process.env.JWT_SECRETKEY,
      { expiresIn: "1d" },
      async (err, token) => {
        await Session.create({ email, accessToken: token });
        return res.status(200).json({
          success: true,
          message: "Login successful!",
          responseData: { accessToken: token, userDetails: user },
        });
      }
    );
  } else {
    return errorHandler(res, 404, "Invalid credentials!");
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Generate a random token
    const token = crypto.randomBytes(20).toString("hex");

    // Create a password reset link
    const resetLink = `https://dumbbelldoor.netlify.app/reset-password/${token}`;

    // Send an email with the reset link
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
      to: "shikher.jaitly@gmail.com",
      subject: "Password Reset",
      html: `<p>You have requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log(error);
        return errorHandler(res, 500, "Error sending email");
      } else {
        try {
          // Store the token with the user's email in MongoDB
          await ForgotPassword.create({ email, token });
          console.log("Email sent: " + info.response);
          return responseHandler(res, 200, "Password reset email sent");
        } catch (error) {
          console.error(error);
          return errorHandler(res, 500, "Error storing password reset token");
        }
      }
    });
  } catch (error) {
    console.error(error);
    return errorHandler(res, 500, "Error generating password reset token");
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Find the token in MongoDB
    const tokenDocument = await ForgotPassword.findOne({ token });

    if (!tokenDocument) {
      return errorHandler(res, 400, "Invalid or expired token");
    }

    // Reset the password for the user associated with the token
    // You should implement your own logic to update the user's password
    console.log(newPassword);

    // Delete the token from MongoDB after password reset
    await ForgotPassword.deleteOne({ token });
    return responseHandler(res, 200, "Password reset successfully");
  } catch (error) {
    console.error(error);
    return errorHandler(res, 500, "Error resetting password");
  }
};

export { signup, login, forgotPassword, resetPassword };

//tested
