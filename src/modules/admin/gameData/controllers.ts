import { Request, Response } from "express";
import { GameData } from "../../../entities/gameData";
import { makeDataUpdate } from "../../../utils/makeDataUpdate";
import adminGameDataServices from "./services";

const updateUserGameData = async (req: Request, res: Response) => {
  const { userId, boardId } = req.params;
  const { remainGem, totalGem, currentCoin, currentLevel, dataOtherGame, blockedTo } = req.body;
  const gameData: GameData = makeDataUpdate({
    remainGem,
    totalGem,
    currentCoin,
    currentLevel,
    dataOtherGame,
    blockedTo,
  });
  const updatedGameData = await adminGameDataServices.updateUserGameData(Number(userId), Number(boardId), gameData);
  return res.status(200).json({
    status: "success",
    result: updatedGameData,
  });
};

export default { updateUserGameData };
