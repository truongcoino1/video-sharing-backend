import { getRepository, SelectQueryBuilder } from "typeorm";
import configs from "../../../configs";
import { Game } from "../../../entities/game";
import CustomError from "../../../errors/customError";
import { Pagination } from "../../../types/type.pagination";

const createGame = async (game: Game) => {
  const gameRepo = getRepository(Game);
  const newGame = await gameRepo.save(game);
  return newGame;
};

const updateGame = async (id: number, game: Game) => {
  delete game.id;
  const findGames = await getGames({ pagination: { limit: 1, offset: 0 }, filter: { id } });
  if (!findGames.length) {
    throw new CustomError(400, "Game not found!");
  }
  const gameRepo = getRepository(Game);
  await gameRepo.update(id, game);
  return {
    ...findGames[0],
    ...game,
  };
};

const getGames = async (params: { pagination?: Pagination; filter?: Game }) => {
  const gameRepo = getRepository(Game);
  const query = gameRepo.createQueryBuilder("g");
  makeQueryOr(query, params.filter);
  query.skip(params.pagination?.offset ?? 0);
  query.take(params.pagination?.limit ?? configs.MAX_RECORDS_PER_REQ);
  return await query.getMany();
};

const makeQueryOr = (query: SelectQueryBuilder<Game>, filter: Game) => {
  let key: keyof Game;
  for (key in filter) {
    if (filter[key]) {
      query.orWhere(`g.${key} = :${key}`, { [key]: filter[key] });
    }
  }
};

const deleteGame = async (id: number) => {
  const findGames = await getGames({ pagination: { limit: 1, offset: 0 }, filter: { id } });
  if (!findGames.length) {
    throw new CustomError(400, "Game not found!");
  }
  const gameRepo = getRepository(Game);
  await gameRepo.delete(id);
  return findGames[0];
};

const gameServices = {
  create: createGame,
  update: updateGame,
  get: getGames,
  delete: deleteGame,
};

export default gameServices;
