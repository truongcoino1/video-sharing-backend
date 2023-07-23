import movieService from "../services/movie";
import { Request, Response } from "express";

const getMovies = async (req: Request, res: Response) => {
  const movie = await movieService.getMovies(req.body);
  return res.status(200).json({
    status: "success",
    result: movie,
  });
};

const shareMovie = async (req: Request, res: Response) => {
  const movie = await movieService.createMovie(req.body);
  return res.status(200).json({
    status: "success",
    result: movie,
  });
};

export default {
  getMovies,
  shareMovie,
};
