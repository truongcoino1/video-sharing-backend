import { getRepository } from "typeorm";
import { User } from "../../../entities/user";
import { makeDataUpdate } from "../../../utils/makeDataUpdate";
import { findIfOneCondition } from "./get";

const createUser = async (dataRegister: User) => {
  const userRepository = getRepository(User);
  let user = makeDataUpdate(dataRegister) as User;
  const validUser = await findIfOneCondition({ email: user.email });
  if (validUser) {
    return validUser;
  }
  return await userRepository.save(user);
};

export { createUser };
