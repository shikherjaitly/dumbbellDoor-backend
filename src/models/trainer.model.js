import mongoose from "mongoose";
import bcrypt from "bcrypt";

const trainerSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    profileStatus: { type: String },
    password: { type: String, required: true },
    role: { type: String },
    gender: { type: String },
    profilePicture: { type: String },
    description: { type: String },
    yearsOfExperience: { type: String },
    rating: { type: Number },
    certifications: [{ type: String }],
    specializations: [{ type: String }],
    typesOfServices: [{ type: String }],
    availability: [
      {
        day: { type: String },
        startTime: { type: Number, min: 0, max: 24 },
        endTime: { type: Number, min: 0, max: 24 },
      },
    ],
    location: { type: String },
    phoneNumber: { type: String },
    instagram: { type: String },
    facebook: { type: String },
  },
  { timestamps: true }
);

trainerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

export const Trainer = mongoose.model("Trainer", trainerSchema);
