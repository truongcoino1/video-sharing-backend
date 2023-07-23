import { Request, Response } from "express";
import { Board } from "../../../entities/board";
import { Pagination } from "../../../types/type.pagination";
import boardServices from "./services";

const getBoards = async (req: Request, res: Response) => {
  const { offset, limit, id, gameId, isHistory } = req.query;
  const pagination: Pagination = {
    offset: Number(offset ?? 0),
    limit: Number(limit ?? 0),
  };
  const filter: Board = {
    id: Number(id) || undefined,
    gameId: Number(gameId) || undefined,
    isHistory: isHistory === "true" ? true : false,
  };
  const boards = await boardServices.getBoards({ pagination, filter });
  return res.status(200).json({
    status: "success",
    result: boards,
  });
};

const createBoard = async (req: Request, res: Response) => {
  const { name, gameId, resetType } = req.body;
  const board = await boardServices.createBoard({ name, gameId, resetType });
  return res.status(200).json({
    status: "success",
    result: board,
  });
};

const updateBoard = async (req: Request, res: Response) => {
  const { name, gameId, resetType } = req.body;
  const { id } = req.params;
  const board = await boardServices.updateBoard(Number(id), { name, gameId, resetType });
  return res.status(200).json({
    status: "success",
    result: board,
  });
};

const deleteBoard = async (req: Request, res: Response) => {
  const { id } = req.params;
  const board = await boardServices.deleteBoard(Number(id));
  return res.status(200).json({
    status: "success",
    result: board,
  });
};

export default { getBoards, createBoard, updateBoard, deleteBoard };
