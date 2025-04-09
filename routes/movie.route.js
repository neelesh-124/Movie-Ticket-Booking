import { Router } from "express";
import Movie from "../models/movie.model.js";

const router = Router();

router.get("/movies", async (req, res) => {
    // Retrieve a list of all movies from mongoDB.

    const movies = await Movie.find({});

    res.send(movies).status(200);
});

router.post("/book", async (req, res) => {
    // Book ticket for a particular movie.
    const { title, showtime } = req.body;

    // finding movie in DB by title
    const result = await Movie.findOne({ title });
    if (!result) {
        // if movie name is invalid
        console.log("Invalid movie name");
        res.send({ error: "Invalid Movie Name" }).status(300);
    } else if (result.showtime.availableSeats == 0) {
        res.send({ msg: "No available seats" }).status(200);
    }

    // else update the count of no of available seats
    await Movie.updateOne(
        { title: title },
        { $inc: { "showtime.$.availableSeats": -1 } }
    );

    res.send({ msg: "Movie ticket booked successfully" }).status(200);
});

router.post("/add-movie", async (req, res) => {
    const { title, description, time, seatsAvailable, duration } = req.body;
    // Here we will do some pre-processing based on how we are planning to receive the time. Then we create a Date() type object and then insert it into the DB.

    /*
    const newmovie=new Movie({
        ttile:title,
        description:description,

    });
    await newmovie.save();
    */
    await Movie.create({
        title,
        description,
        showtime: { time: time, availableSeats: seatsAvailable },
        duration,
    });

    res.send({ msg: "Movie inserted successfully" }).status(200);
});
