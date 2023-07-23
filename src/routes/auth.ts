import express from "express";
import auth from "../modules/auth/controllers";
import asyncMiddleware from "../middlewares/async";

const router = express.Router();

router.post("/auth/register-by-device", asyncMiddleware(auth.createUserByDevice));
router.post("/users", asyncMiddleware(auth.createUser));
router.get("/users", asyncMiddleware(auth.getUsers));
router.put("/users/:userId", asyncMiddleware(auth.updateInfo));
router.delete("/users/:userId", asyncMiddleware(auth.deleteUser));
router.post("/boards/:boardId/data", asyncMiddleware(auth.updateGameData));
router.get("/boards/:boardId/data", asyncMiddleware(auth.getGameData));
router.post("/auth/login/google", asyncMiddleware(auth.loginGoogle));
router.post("/auth/login/facebook", asyncMiddleware(auth.loginFacebook));
router.post("/auth/refresh-token", asyncMiddleware(auth.refreshToken));
router.post("/auth/logout", asyncMiddleware(auth.logout));

export default router;
