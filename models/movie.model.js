import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        showtime: {
            time: { type: String, required: true },
            availableSeats: {
                type: Number,
                min: [0, "Seats cannot be less than zero"],
            },
        },
        duration: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Movie = mongoose.model("movie", movieSchema);

export default Movie;
