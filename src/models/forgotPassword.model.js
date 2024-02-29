import mongoose from "mongoose";

const forgotPasswordSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

export const ForgotPassword = mongoose.model(
  "ForgotPassword",
  forgotPasswordSchema
);
