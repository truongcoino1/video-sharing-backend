import { describe, it, expect, jest, beforeEach, afterAll } from "@jest/globals";
import movieControllers from "..";
import { res } from "../../../../tests/mock";
import server from "../../../..";

describe("movie controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await server.close();
  });

  describe("getMovies", () => {
    it("should return status 200 when get movies success", async () => {
      const req = {
        query: {
          page: 1,
          limit: 10,
        },
      } as any;
      await movieControllers.getMovies(req, res);
      expect(res.status(200).json).toHaveBeenCalledWith({
        status: "success",
        result: [],
      });
    });
  });

  describe("shareMovie", () => {
    it("should return status 200 when share movie success", async () => {
      const req = {
        body: {
          title: "test",
          description: "test",
          url: "test",
        },
      } as any;
      await movieControllers.shareMovie(req, res);
      expect(res.status(200).json).toHaveBeenCalledWith({
        status: "success",
        result: {
          id: 1,
        },
      });
    });
  });
});

jest.mock("../../services/movie", () => {
  return {
    getMovies: jest.fn().mockReturnValue([]),
    createMovie: jest.fn().mockReturnValue({ id: 1 }),
  };
});
