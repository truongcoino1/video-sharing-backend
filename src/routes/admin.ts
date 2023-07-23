import express from "express";
import asyncMiddleware from "../middlewares/async";
import adminUserControllers from "../modules/admin/user/controllers";
import adminGameDataControllers from "../modules/admin/gameData/controllers";

const router = express.Router();

router.put("/admin/users/:userId", asyncMiddleware(adminUserControllers.updateUserInfo));
router.put("/admin/boards/:boardId/users/:userId/point", asyncMiddleware(adminGameDataControllers.updateUserGameData));
router.get("/admin/users", asyncMiddleware(adminUserControllers.getUsers));

export default router;
