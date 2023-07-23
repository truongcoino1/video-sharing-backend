import { Request, Response } from "express";
import publicBoardServices from "./services";

const refreshBoard = async (_req: Request, res: Response) => {
  await publicBoardServices.refreshBoard();
  return res.status(200).json({ message: "success" });
};

export default { refreshBoard };
