import express from "express";
import cors from "cors";
import errorHandler from "./utils/errorHandler.js";
import userRouter from "../src/routes/user.route.js";
import trainerRouter from "../src/routes/trainer.route.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", userRouter);
app.use("/api/trainer", trainerRouter);

app.use("*", (req, res) => {
  errorHandler(res, 404, "Oops...something went wrong!");
});

export { app };
