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
      }
    ).then(() => {
      return responseHandler(res, 200, "Profile completed!");
    });
  } catch (error) {
    errorHandler(res, 500, error.message);
  }
};

export { buildTrainerProfile };
