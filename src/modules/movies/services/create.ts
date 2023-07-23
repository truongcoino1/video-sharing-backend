import { getRepository } from "typeorm";
import { makeDataUpdate } from "../../../utils/makeDataUpdate";
import { findIfAllCondition } from "./get";
import { Movie } from "../../../entities/movie";

const createMovie = async (movieData: Movie) => {
  const movieRepository = getRepository(Movie);
  let movie = makeDataUpdate(movieData) as Movie;
  const validUser = await findIfAllCondition(movie);
  if (validUser) {
    return validUser;
  }
  return await movieRepository.save(movie);
};

export { createMovie };
