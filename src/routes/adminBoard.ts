import express from "express";
import asyncMiddleware from "../middlewares/async";
import adminBoardControllers from "../modules/admin/board/controllers";

const router = express.Router();

router.post("/admin/boards", asyncMiddleware(adminBoardControllers.createBoard));
router.get("/admin/boards", asyncMiddleware(adminBoardControllers.getBoards));
router.put("/admin/boards/:id", asyncMiddleware(adminBoardControllers.updateBoard));
router.delete("/admin/boards/:id", asyncMiddleware(adminBoardControllers.deleteBoard));

export default router;
