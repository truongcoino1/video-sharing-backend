import { describe, it, expect, jest, afterAll } from "@jest/globals";
import { createMovie } from "../create";

describe("createMovie", () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  it("should return a movie when create", async () => {
    const movie = await createMovie({
      title: "test",
      description: "test",
      thumbnail: "test",
      shared_by: "test@gmail.com",
      youtube_id: "test",
    });
    expect(movie.title).toBe("test");
    expect(movie.description).toBe("test");
    expect(movie.youtube_id).toBe("test");
  });

  it("should not return a movie when missing youtube_id", async () => {
    try {
      await createMovie({
        title: null,
        description: "test",
        thumbnail: "test",
        shared_by: "test",
        youtube_id: null,
      });
    } catch (error: any) {
      expect(error.message).toBe("Youtube id and shared by is required!");
    }
  });

  it("should not return a movie when missing shared_by", async () => {
    try {
      await createMovie({
        title: null,
        description: "test",
        thumbnail: "test",
        shared_by: null,
        youtube_id: "test",
      });
    } catch (error: any) {
      expect(error.message).toBe("Youtube id and shared by is required!");
    }
  });
});
