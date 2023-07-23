import { getRepository } from "typeorm";
import { User } from "../../../entities/user";
import { makeDataUpdate } from "../../../utils/makeDataUpdate";
import { findIfAllCondition, findIfOneCondition } from "./get";
import { updateUserInfo } from "./update";
import crypto from "crypto";
import { generateAccessToken, generateRefreshToken } from "./helper";
import CustomError from "../../../errors/customError";
import codes from "../../../errors/codes";
import { Token } from "../../../entities/token";
import configs from "../../../configs";

const createUser = async (dataRegister: User, canUpdate?: boolean) => {
  const userRepository = getRepository(User);
  let user = makeDataUpdate(dataRegister) as User;
  const validUser = await findIfOneCondition({ email: user.email, name: user.name });
  if (validUser) {
    if (canUpdate) {
      return updateUserInfo(validUser.id, user);
    }
    throw new CustomError(codes.DUPLICATE, "User already exists!");
  }
  return await userRepository.save(user);
};

const createUserByDeviceId = async (params: { name: string }) => {
  let user: User = await findIfAllCondition({ name: params.name });
  if (!user) {
    const randomString = crypto.randomBytes(64).toString("hex");
    user = await createUser({
      guestId: randomString,
      name: params.name,
    });
  }
  const token = await generateAccessToken(user.id);
  const refreshToken = await generateRefreshToken(user.id);
  await saveRefreshToken(user.id, refreshToken);
  return {
    ...user,
    token,
    refreshToken,
  };
};

const createUserSocialMedia = async (dataRegister: User, canUpdate?: boolean) => {
  const user = await createUser(dataRegister, canUpdate);
  const token = await generateAccessToken(user.id);
  const refreshToken = await generateRefreshToken(user.id);
  await saveRefreshToken(user.id, refreshToken);
  return {
    ...user,
    token,
    refreshToken,
  };
};

const saveRefreshToken = async (userId: number, refreshToken: string) => {
  const tokenRepo = getRepository(Token);
  const newToken = new Token();
  newToken.userId = userId;
  newToken.token = refreshToken;
  newToken.expireAt = new Date(Date.now() + configs.TIME_REFRESH_TOKEN_EXPIRE);
  await tokenRepo.save(newToken);
};

export { createUser, createUserByDeviceId, createUserSocialMedia };
