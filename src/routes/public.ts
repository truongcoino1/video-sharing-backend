import express from "express";
import asyncMiddleware from "../middlewares/async";
import publicBoardControllers from "../modules/public/board/controllers";

const router = express.Router();

router.post("/public/refresh-board", asyncMiddleware(publicBoardControllers.refreshBoard));

export default router;
