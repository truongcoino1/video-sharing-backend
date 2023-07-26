import { describe, it, expect, afterAll, jest } from "@jest/globals";
import request from "supertest";
import server from "../..";

jest.mock("../../modules/auth/services/helper", () => {
  return {
    verifyAccessToken: jest.fn().mockReturnValue({ id: 1 }),
    hashBcrypt: jest.fn().mockReturnValue("123"),
    generateSalt: jest.fn().mockReturnValue("123"),
    compareBcrypt: jest.fn().mockReturnValue(true),
  };
});

describe("Movie", () => {
  afterAll(async () => {
    await server.close();
  });

  describe("GET /api/public/movie", () => {
    it("should return status 200 and return movies", async () => {
      const response = await request(server).get("/api/public/movie");
      expect(response.status).toBe(200);
    });
  });

  describe("POST /api/movie", () => {
    it("should return status 200 and return movie", async () => {
      const response = await request(server).post("/api/movie").set("authorization", "Bearer abs").send({
        title: "test",
        description: "test",
        youtube_id: "test",
        shared_by: "test",
        thumbnail: "",
      });
      expect(response.status).toBe(200);
    });
  });
});
