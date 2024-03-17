//store the session in cookies and make a sign out endpoint to remove the session from the database
//add an admin route that lists all users with
//todo imporve the logout code
//todo create a middleware to run before everycode
//todo

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
    await user.create({ email, password, profileStatus: "incomplete"});
    return responseHandler(res, 200, "Signup successful!");
  } catch (error) {
    return errorHandler(res, 400, "An error occurred: " + error);
  }
};

const logout = async (req, res) => {
  // Destroy session data and remove cookie from
  // client's browser to log out the
  // current logged in user by clearing the
  // session

  try {
    console.log(req.cookies);
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return errorHandler(res, 403, "No Access Token found");
    }

    await Session.deleteOne({ accessToken });

    res.clearCookie("accessToken");
    res.clearCookie("userEmail");
    res.clearCookie("userId");
    res.clearCookie("userRole");
    res.clearCookie("userProfileStatus");

    return responseHandler(res, 200, "LogOut successfull");
  } catch (error) {
    console.error(error);
    return errorHandler(res, 500, "Error Loggin Out");
  }
};

const login = async (req, res) => {
  try {
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

    // Check if user exists in Trainer collection
    let user = await Trainer.findOne({ email });
    let role = "Trainer"; // Assuming Trainer as default role
    if (!user) {
      // If not found in Trainer collection, check in Customer collection
      user = await Customer.findOne({ email });
      role = "Customer"; // Assuming Customer as default role
    }

    if (!user) {
      return errorHandler(res, 400, `User is not registered!`);
    }

    // Validate user credentials
    const validUser = await bcrypt.compare(password, user.password);
    if (validUser) {
      // Generate JWT token
      const token = jwt.sign(
        { email: user.email, role },
        process.env.JWT_SECRETKEY,
        { expiresIn: "1d" }
      );

      // Store the token in a cookie
      const cookieObject = {
        accessToken: token,
        userId: user.id,
        userEmail: user.email,
        userRole: role,
        userProfileStatus: user.profileStatus,
      };
      res.cookie("accessToken", token, { httpOnly: true });
      res.cookie("userEmail", email);
      res.cookie("userId", user.id);
      res.cookie("userRole", role);
      res.cookie("userProfileStatus", user.profileStatus);

      // Create session
      await Session.create({ email: user.email, accessToken: token });

      return res.status(200).json({
        success: true,
        message: "Login successful!",
        responseData: cookieObject,
      });
    } else {
      return errorHandler(res, 404, "Invalid credentials!");
    }
  } catch (error) {
    console.error(error);
    return errorHandler(res, 500, "Error during login");
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
      to: email,
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
  const hashedNewPassword = await bcrypt.hash(newPassword, 8);
  try {
    // Find the token in MongoDB
    const tokenDocument = await ForgotPassword.findOne({ token });

    if (!tokenDocument) {
      return errorHandler(res, 400, "Invalid or expired token");
    }

    let updatedUser;
    if (await Trainer.exists({ email: tokenDocument.email })) {
      updatedUser = await Trainer.findOneAndUpdate(
        { email: tokenDocument.email },
        { password: hashedNewPassword }
      );
    } else if (await Customer.exists({ email: tokenDocument.email })) {
      updatedUser = await Customer.findOneAndUpdate(
        { email: tokenDocument.email },
        { password: hashedNewPassword }
      );
    }

    // Delete the token from MongoDB after password reset
    await ForgotPassword.deleteOne({ token });

    if (updatedUser) {
      return responseHandler(res, 200, "Password reset successfully");
    } else {
      return errorHandler(
        res,
        400,
        "User not found or email not associated with any collection"
      );
    }
  } catch (error) {
    console.error(error);
    return errorHandler(res, 500, "Error resetting password");
  }
};

export { signup, login, forgotPassword, resetPassword, logout };

//tested
