import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import errorHandler from "./utils/errorHandler.js";
import userRouter from "../src/routes/user.route.js";
import trainerRouter from "../src/routes/trainer.route.js";
import bookingRouter from "../src/routes/booking.route.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/api/auth", userRouter);
app.use("/api/trainer", trainerRouter);
app.use("/api/bookings", bookingRouter);

app.use("*", (req, res) => {
  errorHandler(res, 404, "Oops...something went wrong!");
});

export { app };
//tested
