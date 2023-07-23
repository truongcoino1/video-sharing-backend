import express from "express";
import asyncMiddleware from "../middlewares/async";
import boardControllers from "../modules/board/controllers";

const router = express.Router();

router.get("/boards", asyncMiddleware(boardControllers.getBoards));

export default router;
