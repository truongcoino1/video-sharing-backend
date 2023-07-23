import { Request, Response } from "express";
import { Board } from "../../../entities/board";
import { Game } from "../../../entities/game";
import { User } from "../../../entities/user";
import { SORTBY } from "../../../types/type.filter";
import { Pagination } from "../../../types/type.pagination";
import { validateSort } from "../../auth/controllers/validate";
import adminUserService from "./services";

const updateUserInfo = async (req: Request, res: Response) => {
  const { isBlackList, role } = req.body;
  const { userId } = req.params;
  const user = await adminUserService.updateUserInfo(Number(userId), { isBlackList, role });
  return res.status(200).json({
    status: "success",
    result: user,
  });
};

const getUsers = async (req: Request, res: Response) => {
  const { offset, limit, startAt, endAt, nation, sortGem, sortLevel, gameId, boardId } = req.query;
  validateSort([sortGem, sortLevel]);
  const pagination: Pagination = { limit: Number(limit), offset: Number(offset) };
  const sort = {
    sortLevel: sortLevel ? (String(sortLevel).toUpperCase() as SORTBY) : null,
    sortGem: sortGem ? (String(sortGem).toUpperCase() as SORTBY) : null,
  };
  const period = {
    startAt: startAt ? new Date(String(startAt)).toISOString() : null,
    endAt: endAt ? new Date(String(endAt)).toISOString() : null,
  };
  const user: User = { nation: nation ? String(nation) : null };
  const game: Game = { id: gameId ? Number(gameId) : null };
  const board: Board = { id: boardId ? Number(boardId) : null };
  const users = await adminUserService.getUsers({ pagination, sort, user, period, game, board });
  return res.status(200).json({
    status: "success",
    result: users,
  });
};

export default { updateUserInfo, getUsers };
