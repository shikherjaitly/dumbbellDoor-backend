import express from "express";
import {
  buildCustomerProfile,
  fetchCustomerDetails,
} from "../controllers/cutomer.controller.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.patch(
  "/build-your-profile",
  upload.single("profilePicture"),
  buildCustomerProfile
);

router.get(`/fetchCustomerDetails/:_id`, fetchCustomerDetails);

export default router;
