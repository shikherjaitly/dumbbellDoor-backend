import express from "express";
import cors from "cors";
import crypto from "crypto";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import errorHandler from "./utils/errorHandler.js";
import userRouter from "../src/routes/user.route.js";
import trainerRouter from "../src/routes/trainer.route.js";
import bookingRouter from "../src/routes/booking.route.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

const generateRandomString = (length) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") // convert to hexadecimal format
    .slice(0, length); // return required number of characters
};

const sessionSecretKey = generateRandomString(32);

app.use(
  session({
    secret: sessionSecretKey,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("Google Profile:", profile);
      // Save user profile data to the database or perform other actions
      return done(null, profile);
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect home or send JWT token
    res.redirect("/");
  }
);

app.use("/api/auth", userRouter);
app.use("/api/trainer", trainerRouter);
app.use("/api/bookings", bookingRouter);

app.use("*", (req, res) => {
  errorHandler(res, 404, "Oops...something went wrong!");
});

export { app };
//tested
