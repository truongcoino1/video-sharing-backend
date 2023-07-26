import { getRepository } from "typeorm";
import { Movie } from "../../../entities/movie";
import { SORTBY } from "../../../types/type.filter";
import config from "../../../configs";

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
  query.limit(pageSize || config.MAX_RECORDS_PER_REQ);
  return await query.getMany();
};

export { getMovies };
