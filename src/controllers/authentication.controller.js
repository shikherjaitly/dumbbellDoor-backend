import emailValidator from "deep-email-validator";
import dotenv from "dotenv";
import errorHandler from "../utils/errorHandler.js";
import responseHandler from "../utils/responseHandler.js";
import { Customer } from "../models/customer.model.js";
import { Trainer } from "../models/trainer.model.js";

dotenv.config({
  path: "./.env",
});

const signUp = async (req, res) => {
  const { email, password, role } = req.body;
  if (!(email && password && role)) {
    return errorHandler(res, 406, "All fields are mandatory!");
  }

  const isEmailValid = async () => {
    return emailValidator.validate(email);
  };

  const response = await isEmailValid();

  if (!response.valid) {
    return errorHandler(res, 400, "Please provide a valid email address!");
  }

  // check if a document already exists under the same email

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
export { signUp };
