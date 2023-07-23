import { getRepository, SelectQueryBuilder } from "typeorm";
import configs from "../../configs";
import { GameData } from "../../entities/gameData";
import CustomError from "../../errors/customError";
import { Pagination } from "../../types/type.pagination";

const createGameData = async (gameData: GameData) => {
  const gameDataRepo = getRepository(GameData);
  const newGameData = await gameDataRepo.save(gameData);
  return newGameData;
};

const updateGameData = async (id: number, gameData: GameData) => {
  const findGameData = await getGameData({ pagination: { limit: 1, offset: 0 }, filter: { id } });
  if (!findGameData.length) {
    throw new CustomError(400, "Game data not found!");
  }
  const gameDataRepo = getRepository(GameData);
  delete gameData.id;
  await gameDataRepo.update(id, gameData);
  return {
    ...findGameData,
    ...gameData,
  };
};

const getGameData = async (params: { pagination?: Pagination; filter?: GameData }) => {
  const { pagination, filter } = params;
  const gameDataRepo = getRepository(GameData);
  const query = gameDataRepo.createQueryBuilder("gd");
  makeQueryAnd(query, filter);
  query.skip(pagination?.offset ?? 0);
  query.take(pagination?.limit ?? configs.MAX_RECORDS_PER_REQ);
  return await query.getMany();
};

const makeQueryAnd = (query: SelectQueryBuilder<GameData>, filter: GameData) => {
  let key: keyof GameData;
  for (key in filter) {
    if (filter[key]) {
      query.andWhere(`gd.${key} = :${key}`, { [key]: filter[key] });
    }
  }
};

const gameDataServices = {
  create: createGameData,
  update: updateGameData,
  get: getGameData,
};

export default gameDataServices;
