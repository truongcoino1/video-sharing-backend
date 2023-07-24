import { getRepository } from "typeorm";
import { makeDataUpdate } from "../../../utils/makeDataUpdate";
import { Movie } from "../../../entities/movie";
import CustomError from "../../../errors/customError";
import codes from "../../../errors/codes";

const createMovie = async (movieData: Movie) => {
  if (!movieData.youtube_id || !movieData.shared_by) {
    throw new CustomError(codes.BAD_REQUEST, "Youtube id and shared by is required!");
  }
  const movieRepository = getRepository(Movie);
  const movie = makeDataUpdate(movieData) as Movie;
  return await movieRepository.save(movie);
};

export { createMovie };
