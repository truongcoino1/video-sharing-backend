import express from "express";
import asyncMiddleware from "../middlewares/async";
import { createGame, deleteGame, getGames, updateGame } from "../modules/admin/game/controllers";

const router = express.Router();

router.post("/admin/games", asyncMiddleware(createGame));
router.get("/admin/games", asyncMiddleware(getGames));
router.put("/admin/games/:id", asyncMiddleware(updateGame));
router.delete("/admin/games/:id", asyncMiddleware(deleteGame));

export default router;
