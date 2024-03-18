import { uploadProfilePictureToCloudinary } from "../utils/cloudinary.js";
import errorHandler from "../utils/errorHandler.js";
import responseHandler from "../utils/responseHandler.js";
import { Customer } from "../models/customer.model.js";

const buildCustomerProfile = async (req, res) => {
  const {
    name,
    email,
    gender,
    location,
    phoneNumber,
    height,
    weight,
    age,
    language,
    fitnessGoals,
    bodyFat,
  } = req.body;

  const profilePicture = req.file?.path;

  if (
    !(
      (
        name &&
        email &&
        gender &&
        profilePicture &&
        location &&
        phoneNumber &&
        height &&
        weight &&
        age &&
        language
      )
      // fitnessGoals
    )
  ) {
    return errorHandler(res, 406, "All fields are mandatory!");
  }

  try {
    const profilePicturePath = await uploadProfilePictureToCloudinary(
      profilePicture
    );
    if (!profilePicturePath) {
      return errorHandler(res, 500, "Failed to upload file on cloudinary!");
    }
    await Customer.updateOne(
      {
        email,
      },
      {
        name,
        role: "Customer",
        gender,
        profilePicture: profilePicturePath,
        location,
        phoneNumber,
        height,
        weight,
        age,
        language,
        // fitnessGoals,
        bodyFat,
        profileStatus: "complete",
      }
    ).then(() => {
      return responseHandler(res, 200, "Profile completed!");
    });
  } catch (error) {
    errorHandler(res, 500, error.message);
  }
};

const fetchCustomerDetails = async (req, res) => {
  const { _id } = req.params;
  try {
    const customerDetails = await Customer.findById({ _id });
    return responseHandler(res, 200, customerDetails);
  } catch (error) {
    errorHandler(res, 500, "Error fetching customer details!");
  }
};

export { buildCustomerProfile, fetchCustomerDetails };
