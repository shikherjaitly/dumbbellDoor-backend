import emailValidator from "deep-email-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import errorHandler from "../utils/errorHandler.js";
import responseHandler from "../utils/responseHandler.js";

dotenv.config({
  path: "./.env",
});

const signUp = async (req, res) => {
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

  return responseHandler(res, 200, "SignUp successful!");
};
export { signUp };
