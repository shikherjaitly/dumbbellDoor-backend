import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import errorHandler from "./utils/errorHandler.js";
import userRouter from "../src/routes/user.route.js";
import trainerRouter from "../src/routes/trainer.route.js";
import bookingRouter from "../src/routes/booking.route.js";
import cookieParser from "cookie-parser";
import customerRouter from "../src/routes/customer.route.js";

const app = express();
dotenv.config();

const corsOptions = {
  origin: ["http://localhost:3000", "*"],
  credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/auth", userRouter);
app.use("/api/trainer", trainerRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/customer", customerRouter);

app.use("*", (req, res) => {
  errorHandler(res, 404, "Oops...something went wrong!");
});

export { app };
//tested
