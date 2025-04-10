import { Router } from "express";
import User from "../models/user.model.js";

const router = Router();

router.post("/signup", async (req, res) => {
  const { fullName, userId, email, password } = req.body;

  let plainPassword = password;

  if (!fullName || !userId || !email || !password)
    res.send({ err: "Input fields cannot be empty!" }).status(300);

  // we need to write this hashing algorithm inside user model, so that whenever the user changed password it is rehashed again. But for now we do not have any change password route so we are going with this.
  bcrypt.hash(password, 10).then(function (err, hash) {
    // Store hash in your password DB.
    if (err) console.log("Error hashing password");
    else password = hash;
  });

  console.log("Plain text password: ", plainPassword);
  console.log("Hashed password: ", password);

  await User.create({
    fullName,
    userId,
    email,
    password,
  });
});

router.post("/signin", async (req, res) => {
  const { userId, password } = req.body;
  // check if user exists in DB
  const user = await User.findOne({ userId: userId });

  if (!user) res.send({ msg: "Invalid userId or password!" }).status(300);

  const compareResult = bcrypt.compare(password, user.password);
  console.log("Compare result,", compareResult);
  res.send({ status: "pending" }).status(200);
});

export default router;
