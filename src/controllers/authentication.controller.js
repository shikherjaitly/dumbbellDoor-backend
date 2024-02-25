import emailValidator from "deep-email-validator";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import errorHandler from "../utils/errorHandler.js";
import responseHandler from "../utils/responseHandler.js";
import { Customer } from "../models/customer.model.js";
import { Trainer } from "../models/trainer.model.js";
import { Session } from "../models/session.model.js";

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
          accessToken: token,
        });
      }
    );
  } else {
    return errorHandler(res, 404, "Invalid credentials!");
  }
};

export { signup, login };

//tested