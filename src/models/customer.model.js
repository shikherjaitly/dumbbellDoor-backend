import mongoose from "mongoose";
import bcrypt from "bcrypt";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    role: { type: String },
    profilePicture: { type: String },
    profileStatus: { type: String, required: true },
    phoneNumber: { type: String },
    password: { type: String, required: true },
    gender: { type: String },
    height: { type: String },
    weight: { type: String },
    bodyFat: { type: String },
    age: { type: String },
    language: { type: String },
    location: { type: String },
    fitnessGoals: [{ type: String }],
  },
  { timestamps: true }
);

customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

export const Customer = mongoose.model("Customer", customerSchema);
