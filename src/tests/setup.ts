import { afterAll, beforeAll, beforeEach } from "@jest/globals";
import { createConnection, getRepository } from "typeorm";
import "core-js";
import ormconfig from "../database/ormconfig";
import { User } from "../entities/user";
import { Movie } from "../entities/movie";
import { Token } from "../entities/token";

beforeAll(async () => {
  await createConnection(ormconfig as any);
});

afterAll(async () => {
  const userRepository = getRepository(User);
  await userRepository.clear();
  const movieRepository = getRepository(Movie);
  await movieRepository.clear();
  const tokenRepository = getRepository(Token);
  await tokenRepository.clear();
});

export const initData = async () => {
  const userRepository = getRepository(User);
  await userRepository.save({
    email: "tes12t@gmail.com",
    password: "12322222",
  });

  const movieRepository = getRepository(Movie);
  await movieRepository.save({
    title: "test",
    description: "test",
    thumbnail: "test",
    shared_by: "test@gmail.com",
    youtube_id: "test",
  });

  const tokenRepository = getRepository(Token);

  const user = await userRepository.findOne({ email: "tes12t@gmail.com" });

  await tokenRepository.save({
    userId: user.id,
    expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    token: "token-test-1",
  });
  await tokenRepository.save({
    userId: user.id,
    expireAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    token: "token-test-2",
  });
};
