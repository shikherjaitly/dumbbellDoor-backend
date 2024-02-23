import { Trainer } from "../models/trainer.model.js";
import { uploadProfilePictureToCloudinary } from "../utils/cloudinary.js";
import errorHandler from "../utils/errorHandler.js";
import responseHandler from "../utils/responseHandler.js";

const buildTrainerProfile = async (req, res) => {
  const {
    name,
    email,
    gender,
    description,
    yearsOfExperience,
    certifications,
    specializations,
    typesOfServices,
    availability,
    location,
    phoneNumber,
    testimonials,
    instagram,
    facebook,
  } = req.body;

  const profilePicture = req.file?.path;

  if (
    !(
      name &&
      gender &&
      profilePicture &&
      description &&
      yearsOfExperience &&
      certifications &&
      specializations &&
      typesOfServices &&
      availability &&
      location &&
      phoneNumber
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
    await Trainer.updateOne(
      {
        email,
      },
      {
        name,
        gender,
        profilePicture: profilePicturePath,
        description,
        yearsOfExperience,
        certifications,
        specializations,
        typesOfServices,
        availability,
        location,
        phoneNumber,
        testimonials,
        instagram,
        facebook,
      }
    ).then(() => {
      return responseHandler(res, 200, "Profile completed!");
    });
  } catch (error) {
    errorHandler(res, 500, error.message);
  }
};

const getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find({});
    if (trainers.length === 0) {
      return errorHandler(res, 500, "No trainers found!");
    }
    return responseHandler(res, 200, trainers);
  } catch (error) {
    return errorHandler(
      res,
      500,
      "Error fetching trainers data, please try after sometime!"
    );
  }
};

export { buildTrainerProfile, getTrainers };
