import express from "express";
import { buildTrainerProfile } from "../controllers/trainer.controller.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.patch(
  "/build-your-profile",
  upload.single("profilePicture"),
  buildTrainerProfile
);

export default router;