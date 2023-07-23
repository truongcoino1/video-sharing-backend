import gameServices from "./services";
import { Request, Response } from "express";
import { Pagination } from "../../../types/type.pagination";
import { Game } from "../../../entities/game";

export const createGame = async (req: Request, res: Response) => {
  const { name } = req.body;
  const game = await gameServices.create({ name });
  return res.status(200).json({
    status: "success",
    result: game,
  });
};

export const getGames = async (req: Request, res: Response) => {
  const { offset, limit, id } = req.query;
  const pagination: Pagination = {
    offset: Number(offset ?? 0),
    limit: Number(limit ?? 0),
  };
  const filter: Game = {
    id: Number(id),
  };
  const games = await gameServices.get({ pagination, filter });
  return res.status(200).json({
    status: "success",
    result: games,
  });
};

export const updateGame = async (req: Request, res: Response) => {
  const { name } = req.body;
  const { id } = req.params;
  const game = await gameServices.update(Number(id), { name });
  res.status(200).json({
    status: "success",
    result: game,
  });
};

export const deleteGame = async (req: Request, res: Response) => {
  const { id } = req.params;
  const game = await gameServices.delete(Number(id));
  res.status(200).json({
    status: "success",
    result: game,
  });
};
