import { getRepository } from "typeorm";
import { User } from "../../../entities/user";
import { makeDataUpdate } from "../../../utils/makeDataUpdate";
import { findIfOneCondition } from "./get";
import { generateSalt, hashBcrypt, compareBcrypt } from "./helper";
import CustomError from "../../../errors/customError";
import codes from "../../../errors/codes";

const createUser = async (dataRegister: User) => {
  if (!dataRegister.email || !dataRegister.password) {
    throw new CustomError(codes.BAD_REQUEST, "Password and Email is required!");
  }
  const userRepository = getRepository(User);
  const data = { ...dataRegister, password: await hashBcrypt(dataRegister.password, generateSalt(10)) };
  let user = makeDataUpdate(data) as User;
  const validUser = await findIfOneCondition({ email: user.email });
  if (validUser) {
    const comparePassword = await compareBcrypt(dataRegister.password, validUser.password);
    if (!comparePassword) {
      throw new CustomError(codes.FORBIDDEN, "Password incorrect!");
    }

    return validUser;
  }
  return await userRepository.save(user);
};

export { createUser };
