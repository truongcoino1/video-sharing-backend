import { getRepository } from "typeorm";
import { User } from "../../../entities/user";
import { findIfOneCondition } from "./get";

const updateUserInfo = async (userId: number, data: User): Promise<User> => {
  const checkUser = await findIfOneCondition({ id: userId });
  if (!checkUser) {
    throw new Error("User not found!");
  }
  await updateUser(userId, data);
  return {
    ...checkUser,
    ...data,
  };
};

const updateUser = async (id: number, data: User) => {
  const userRepository = getRepository(User);
  await userRepository.update(id, data);
};

export { updateUserInfo, updateUser };
