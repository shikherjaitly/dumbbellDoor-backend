import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@dumbbelldoor.lwrhwlw.mongodb.net/DumbbellDoor?retryWrites=true&w=majority`;

const mongodbConnection = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Database connected successfully!");
  } catch (error) {
    console.log("Database connection failed!", error);
  }
};

export { mongodbConnection };
