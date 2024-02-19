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
    return emailValidator.validate({ email, validateSMTP: false });
  };

  const response = await isEmailValid();

  console.log(response);

  if (!response.valid) {
    return errorHandler(res, 400, "Please provide a valid email address!");
  }

  // check if a document already exists under the same email

  const existingCustomer = await Customer.findOne({ email });
  const existingTrainer = await Trainer.findOne({ email });

  if (existingCustomer || existingTrainer) {
    return errorHandler(
      res,
      400,
      "Email is already registered, please try with a different account!"
    );
  }

  try {
    if (role === "customer") {
      await Customer.create({ email, password }).then(() => {
        return responseHandler(res, 200, "Signup successful!");
      });
    } else {
      await Trainer.create({ email, password }).then(() => {
        return responseHandler(res, 200, "Signup successful!");
      });
    }
  } catch (error) {
    return errorHandler(res, 400, "An error occurred: " + error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    return errorHandler(res, 406, "Email & password are mandatory!");
  }
  const isEmailValid = async () => {
    return emailValidator.validate(email);
  };

  const response = await isEmailValid();

  if (!response.valid) {
    return errorHandler(res, 400, "Please provide a valid email address!");
  }

  const isActiveUser = await Session.findOne({ email });
  if (isActiveUser) {
    return errorHandler(
      res,
      400,
      "You're already logged in, kindly continue with the session!"
    );
  }

  const registeredCustomer = await Customer.findOne({ email });
  const registeredTrainer = await Trainer.findOne({ email });

  if (!registeredCustomer && !registeredTrainer) {
    return errorHandler(res, 400, `User is not registered!`);
  }

  const login = async (userType, registeredUser, res) => {
    const validUser = await bcrypt.compare(password, registeredUser.password);

    if (validUser) {
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

  const customerLogin = async () => {
    await login("customer", registeredCustomer, res);
  };

  const trainerLogin = async () => {
    await login("trainer", registeredTrainer, res);
  };

  try {
    if (registeredCustomer) {
      customerLogin();
    } else {
      trainerLogin();
    }
  } catch {
    return errorHandler(
      res,
      400,
      "An error occurred, please try logging in again!"
    );
  }
};

export { signup, login };
