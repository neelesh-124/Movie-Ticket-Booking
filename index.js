import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

const app = express();

// connect database
mongoose
    .connect(
        "mongodb+srv://neeleshverma:hello124@cluster0.xvvrh.mongodb.net/movie-ticket-booking"
    )
    .then(() => console.log(`Database connected.`))
    .catch((err) => console.log(`Database connection error: `, err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
