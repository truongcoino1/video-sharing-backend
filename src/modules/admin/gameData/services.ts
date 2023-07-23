import { getRepository } from "typeorm";
import { GameData } from "../../../entities/gameData";

const updateUserGameData = async (userId: number, boardId: number, gameData: GameData) => {
  const gameDataRepo = getRepository(GameData);
  const findGameData = await gameDataRepo.findOne({ where: { userId, boardId } });
  if (!findGameData) {
    throw new Error("Game data not found!");
  }
  await gameDataRepo.update(findGameData.id, gameData);
  return { ...findGameData, ...gameData };
};

export default { updateUserGameData };
