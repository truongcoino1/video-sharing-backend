import { describe, it, expect, jest, afterAll, beforeAll } from "@jest/globals";
import { getMovies } from "../get";
import { getRepository } from "typeorm";
import { Movie } from "../../../../entities/movie";

describe("get Functions", () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  beforeAll(() => {
    const movieRepository = getRepository(Movie);
    movieRepository.save({
      title: "test",
      description: "test",
      thumbnail: "test",
      youtube_id: "test",
      shared_by: "test",
    });
  });

  it("should return movies when params has not lastMovieId", async () => {
    const movies = await getMovies({ pageSize: 10, orderBy: "DESC" });    
    expect(movies).not.toBe(undefined);
  });

  it("should return movies when params has lastMovieId", async () => {
    const movies = await getMovies({ pageSize: 10, lastMovieId: 1, orderBy: "DESC" });
    expect(movies).not.toBe(undefined);
  });
});
