import mongoose from "mongoose";

const sessionSchema = mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    accessToken: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Session = mongoose.model("Session", sessionSchema);
