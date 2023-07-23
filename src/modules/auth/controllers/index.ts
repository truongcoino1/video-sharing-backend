import authService from "../services/auth";
import { Request, Response } from "express";
import { User } from "../../../entities/user";
import CustomError from "../../../errors/customError";
import codes from "../../../errors/codes";
import { makeDataUpdate } from "../../../utils/makeDataUpdate";
import { Pagination } from "../../../types/type.pagination";
import { validateSort } from "./validate";
import { SORTBY } from "../../../types/type.filter";
import { GameData } from "../../../entities/gameData";
import { getPoint, updatePoint } from "../services/point";
import { getNewAccessTokenFromRefreshToken, deleteRefreshToken } from "../services/refresh";
import { Game } from "../../../entities/game";
import axios from "axios";
import { Board } from "../../../entities/board";
import configs from "../../../configs";

const createUserByDevice = async (req: Request, res: Response) => {
  const { name } = req.body;
  const { refreshToken, ...user } = await authService.createUserByDeviceId({ name });
  delete user.role;
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: configs.TIME_REFRESH_TOKEN_EXPIRE,
  });
  return res.status(200).json({
    status: "success",
    result: user,
  });
};

const createUser = async (req: Request, res: Response) => {
  const user: User = (await authService.createUser(req.body)) as User;
  delete user.role;
  return res.status(200).json({
    status: "success",
    result: user,
  });
};

const updateInfo = async (req: Request, res: Response) => {
  const { name, avatar, nation, advertiserId, facebookId, os } = req.body;
  let newInfo: User = makeDataUpdate({
    name,
    avatar,
    nation,
    advertiserId,
    facebookId,
    os,
  });
  if (!newInfo) {
    throw new CustomError(codes.BAD_REQUEST, "No update information about user!");
  }
  const newUser = await authService.updateUserInfo(Number(req.params.userId), newInfo);
  delete newUser.role;
  return res.status(200).json({
    status: "success",
    result: newUser,
  });
};

const getUsers = async (req: Request, res: Response) => {
  const { offset, limit, startAt, endAt, nation, sortGem, sortLevel, gameId, boardId } = req.query;
  validateSort([sortGem, sortLevel]);
  const pagination: Pagination = { limit: Number(limit), offset: Number(offset) };
  const sort = {
    sortLevel: sortLevel ? (String(sortLevel).toUpperCase() as SORTBY) : null,
    sortGem: sortGem ? (String(sortGem).toUpperCase() as SORTBY) : null,
  };
  const period = {
    startAt: startAt ? new Date(String(startAt)).toISOString() : null,
    endAt: endAt ? new Date(String(endAt)).toISOString() : null,
  };
  const user: User = { nation: nation ? String(nation) : null };
  const game: Game = { id: gameId ? Number(gameId) : null };
  const board: Board = { id: boardId ? Number(boardId) : null };
  const users = await authService.getUsers({ pagination, sort, user, period, game, board });
  return res.status(200).json({
    status: "success",
    result: users,
  });
};

const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = await authService.deleteUser(Number(userId));
  return res.status(200).json({
    status: "success",
    result: user,
  });
};

const updateGameData = async (req: Request, res: Response) => {
  const { boardId } = req.params;
  if (req.user.isBlackList) {
    throw new CustomError(codes.FORBIDDEN, "User is in black list!");
  }
  const userId = req.user.id;
  const { remainGem, totalGem, currentCoin, currentLevel, dataOtherGame } = req.body;
  const gameData: GameData = makeDataUpdate({
    remainGem,
    totalGem,
    currentCoin,
    currentLevel,
    dataOtherGame,
  });
  const result = await updatePoint(userId, Number(boardId), gameData);
  return res.status(200).json({
    status: "success",
    result,
  });
};

const getGameData = async (req: Request, res: Response) => {
  const { boardId } = req.params;
  const userId = req.user.id;
  const result = await getPoint(userId, Number(boardId));
  return res.status(200).json({
    status: "success",
    result: result ?? [],
  });
};

const loginGoogle = async (req: Request, res: Response) => {
  const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${req.body.accessToken}`;
  const googleUserRes = await axios.get(url);
  if (googleUserRes.status !== 200) {
    throw new CustomError(codes.BAD_REQUEST, "Invalid access token!");
  }
  const googleUser = googleUserRes.data;
  const newUser = {
    email: googleUser.email,
    name: googleUser.name,
    avatar: googleUser.picture,
  };
  const { refreshToken, ...user } = await authService.createUserSocialMedia(newUser, true);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: configs.TIME_REFRESH_TOKEN_EXPIRE,
  });
  delete user.role;
  return res.status(200).json({
    status: "success",
    result: user,
  });
};

const loginFacebook = async (req: Request, res: Response) => {
  const checkAuth = axios.get(`https://graph.facebook.com/me/${req.body.accessToken}`);
  res.status(200).json({
    status: "success",
    result: checkAuth,
  });
};

const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw new CustomError(codes.BAD_REQUEST, "No refresh token!");
  }
  const accessToken = await getNewAccessTokenFromRefreshToken(refreshToken);
  return res.status(200).json({
    status: "success",
    result: {
      token: accessToken,
    },
  });
};

const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(200).json({
      status: "success",
      result: "Logout success!",
    });
  }
  await deleteRefreshToken(refreshToken);
  return res.status(200).json({
    status: "success",
    result: "Logout success!",
  });
};

export default {
  createUserByDevice,
  updateInfo,
  createUser,
  getUsers,
  deleteUser,
  updateGameData,
  getGameData,
  loginGoogle,
  loginFacebook,
  refreshToken,
  logout,
};
