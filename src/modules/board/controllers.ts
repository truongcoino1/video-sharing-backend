import { Request, Response } from "express";
import { Board } from "../../entities/board";
import { Pagination } from "../../types/type.pagination";
import boardServices from "./services";

const getBoards = async (req: Request, res: Response) => {
  const { offset, limit, id, gameId } = req.query;
  const pagination: Pagination = {
    offset: Number(offset ?? 0),
    limit: Number(limit ?? 0),
  };
  const filter: Board = {
    id: Number(id) || undefined,
    gameId: Number(gameId) || undefined,
  };
  const boards = boardServices.getBoards({ pagination, filter });
  return res.status(200).json({
    status: "success",
    result: boards,
  });
};

export default { getBoards };
