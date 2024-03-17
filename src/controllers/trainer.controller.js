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
        role: "Trainer",
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
        profileStatus: "complete",
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

const fetchTrainerDetails = async (req, res) => {
  const { _id } = req.params;
  try {
    const trainerDetails = await Trainer.findById({ _id });
    return responseHandler(res, 200, trainerDetails);
  } catch (error) {
    errorHandler(res, 500, "Error fetching trainer details!");
  }
};

export { buildTrainerProfile, getTrainers, fetchTrainerDetails };
