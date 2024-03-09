import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

cloudinary.config({
  cloud_name: "dmikdkm52",
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

const uploadProfilePictureToCloudinary = async (filepath) => {
  try {
    const response = await cloudinary.uploader.upload(filepath, {
      public_id: "profile-picture",
    });
    return response.url;
  } catch (error) {
    return false;
  }
};

export { uploadProfilePictureToCloudinary };
