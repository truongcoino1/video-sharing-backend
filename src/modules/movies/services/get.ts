import { getRepository } from "typeorm";
import { Movie } from "../../../entities/movie";
import { SORTBY } from "../../../types/type.filter";

const findIfOneCondition = async (movie: Movie) => {
  const movieRepository = getRepository(Movie);
  let key: keyof Movie;
  let query = movieRepository.createQueryBuilder("m");
  for (key in movie) {
    if (movie[key]) {
      query.orWhere(`m.${key} = :${key}`, { [key]: movie[key] });
    }
  }
  return await query.getOne();
};

const findIfAllCondition = async (movie: Movie) => {
  const movieRepository = getRepository(Movie);
  let key: keyof Movie;
  let query = movieRepository.createQueryBuilder("m");
  for (key in movie) {
    if (movie[key]) {
      query.andWhere(`m.${key} = :${key}`, { [key]: movie[key] });
    }
  }
  return await query.getOne();
};

const getMovies = async (filter: { pageSize: number; lastMovieId?: number; orderBy: SORTBY }) => {
  const { lastMovieId, pageSize, orderBy } = filter;
  const movieRepository = getRepository(Movie);
  const query = movieRepository.createQueryBuilder("m");
  query.select([
    "m.id",
    "m.title",
    "m.description",
    "m.thumbnail",
    "m.youtube_id",
    "m.shared_by",
    "m.createdAt",
    "m.updatedAt",
  ]);
  if (lastMovieId) {
    query.andWhere("m.id < :lastMovieId", { lastMovieId });
  }

  query.orderBy("m.createdAt", orderBy);
  query.limit(pageSize);
  return await query.getMany();
};

export { findIfOneCondition, findIfAllCondition, getMovies };
