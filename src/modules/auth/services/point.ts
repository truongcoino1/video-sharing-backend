import { getRepository } from "typeorm";
import { GameData } from "../../../entities/gameData";
import gameDataServices from "../../game-data/services";

export const updatePoint = async (userId: number, boardId: number, gameData: GameData) => {
  const findGameData = await gameDataServices.get({ filter: { userId, boardId } });
  if (
    findGameData?.[0]?.blockedTo &&
    new Date().getTime() - new Date(findGameData[0].blockedTo).getTime() < 30 * 60 * 1000
  ) {
    throw new Error("You are blocked in 30 minutes!");
  }
  if (!findGameData.length) {
    return await createNewGameData(userId, boardId, gameData);
  }
  return await updateGameData(findGameData[0], gameData);
};

const createNewGameData = async (userId: number, boardId: number, gameData: GameData) => {
  const newData = {
    ...gameData,
    userId,
    boardId,
  };
  return await gameDataServices.create(newData);
};

const updateGameData = async (currentGameData: GameData, updateGameData: GameData) => {
  const gameDataRepo = getRepository(GameData);
  const { countChangeConsecutive } = await updateCountChangeConsecutive(currentGameData);
  if (countChangeConsecutive > 10) {
    blockUpdateGameData(currentGameData);
    throw new Error("You are cheating!");
  }
  await gameDataRepo.update(currentGameData.id, updateGameData);
  return {
    ...currentGameData,
    ...updateGameData,
  };
};

const updateCountChangeConsecutive = async (gameData: GameData) => {
  const gameDataRepo = getRepository(GameData);
  if (checkUpdateConsecutive(gameData)) {
    const countChangeConsecutiveWillBeUpdated = gameData.countChangeConsecutive + 1;
    await gameDataRepo.update(gameData.id, { countChangeConsecutive: countChangeConsecutiveWillBeUpdated });
    return { countChangeConsecutive: countChangeConsecutiveWillBeUpdated };
  }
  await gameDataRepo.update(gameData.id, { countChangeConsecutive: 0 });
  return { countChangeConsecutive: 0 };
};

const checkUpdateConsecutive = (gameData: GameData) => {
  const diff = new Date().getTime() - new Date(gameData.updatedAt).getTime();
  const diffInSeconds = Math.floor(diff / 1000);
  if (diffInSeconds < 6) {
    return true;
  }
  return false;
};

const blockUpdateGameData = async (gameData: GameData) => {
  const gameDataRepo = getRepository(GameData);
  const blockTo = new Date(new Date().getTime() + 30 * 60 * 1000);
  await gameDataRepo.update(gameData.id, { blockedTo: blockTo, countChangeConsecutive: 0 });
};

export const getPoint = async (userId: number, boardId: number) => {
  const findGameData = await gameDataServices.get({ filter: { userId, boardId } });
  if (!findGameData.length) {
    return null;
  }
  return findGameData[0];
};
