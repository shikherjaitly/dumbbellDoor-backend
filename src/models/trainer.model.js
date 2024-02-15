import mongoose from "mongoose";
import bcrypt from "bcrypt";

const trainerSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    description: { type: String },
    yearsOfExperience: { type: String },
    certifications: [{ type: String }],
    specializations: [{ type: String }],
    typesOfServices: [{ type: String }],
    availability: {
      days: [{ type: String }],
      startTime: { type: String },
      endTime: { type: String },
    },
    location: { type: String },
    phoneNumber: { type: String },
    testimonials: [
      {
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
        rating: { type: Number },
        comment: { type: String },
      },
    ],
  },
  { timestamps: true }
);

trainerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

export const Trainer = mongoose.model("Trainer", trainerSchema);
