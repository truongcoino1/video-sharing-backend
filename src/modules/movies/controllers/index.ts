import { SORTBY } from "../../../types/type.filter";
import movieService from "../services/movie";
import { Request, Response } from "express";

const getMovies = async (req: Request, res: Response) => {
  const { lastMovieId, pageSize, orderBy } = req.query;
  const movie = await movieService.getMovies({
    pageSize: Number(pageSize),
    orderBy: orderBy as SORTBY,
    lastMovieId: Number(lastMovieId),
  });
  return res.status(200).json({
    status: "success",
    result: movie,
  });
};

const shareMovie = async (req: Request, res: Response) => {
  const movie = await movieService.createMovie(req.body);
  global.io.emit("share-movie", movie);
  return res.status(200).json({
    status: "success",
    result: movie,
  });
};

export default {
  getMovies,
  shareMovie,
};
