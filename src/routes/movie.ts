import express from "express";
import movie from "../modules/movies/controllers";
import asyncMiddleware from "../middlewares/async";

const router = express.Router();

router.get("/public/movie", asyncMiddleware(movie.getMovies));
router.post("/movie", asyncMiddleware(movie.shareMovie));

export default router;
