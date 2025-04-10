import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import movieRoute from "./routes/movie.route.js";
import userRoute from "./routes/user.route.js";

const app = express();

// connect database
mongoose
  .connect(
    "mongodb+srv://neeleshverma:hello124@cluster0.xvvrh.mongodb.net/movie-ticket-booking"
  )
  .then(() => console.log(`Database connected.`))
  .catch((err) => console.log(`Database connection error: `, err));

app.use(express.urlencoded({ extended: false }));

app.use("/movies", movieRoute);
app.use("/user", userRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
