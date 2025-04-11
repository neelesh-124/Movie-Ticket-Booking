import { Router } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { handlePayment } from "../services/payment.js";
import {
  createJwtTokenForUser,
  validateToken,
} from "../services/authentication.js";

const router = Router();

router.post("/handlePayment", handlePayment);

router.get("/bookings", async (req, res) => {
  const cookie = req.cookies.token;
  if (!cookie) res.status(200).send({ msg: "User not logged in!" });

  const payload = validateToken(cookie);

  // console.log(payload);
  if (!payload) res.status(200).send({ msg: "User not logged in!" });
  const user = await User.findOne({ userId: payload.userId });
  res.status(200).send({ msg: "pending", bookings: user.bookings });
});

router.get("/logout", (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .send({ response: "Cookie cleared, Logged Out" });
});

router.post("/signup", async (req, res) => {
  const { fullName, userId, email, password } = req.body;

  if (!fullName || !userId || !email || !password)
    return res.status(400).send({ err: "Input fields cannot be empty!" });

  // we need to write this hashing algorithm inside user model, so that whenever the user changed password it is rehashed again. But for now we do not have any CHANGE PASSWORD route so we are going with this.
  const hash = await bcrypt.hash(password, 10);

  console.log("Plain text password: ", plainPassword);
  console.log("Hashed password: ", hash);

  await User.create({
    fullName,
    userId,
    email,
    password: hash,
  });
  res.status(200).send({ msg: "User successfully registered" });
});

router.post("/signin", async (req, res) => {
  const { userId, password } = req.body;
  // check if user exists in DB
  const user = await User.findOne({ userId: userId });

  if (!user) res.status(400).send({ msg: "Invalid userId!" });

  const comparePassword = await bcrypt.compare(password, user.password);
  // this promise returns true or false based on entered password is correct or incorrect.

  if (comparePassword == true) {
    // if password is correct we generate a JWT token and store it in the cookies.
    const token = createJwtTokenForUser(user);
    // setting cookie for user
    res.cookie("token", token).status(200).send({ status: "logged in" });
  } else res.status(401).send({ status: "Invalid password!" });
});

export default router;
