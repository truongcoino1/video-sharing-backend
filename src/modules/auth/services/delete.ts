import { getRepository } from "typeorm";
import { User } from "../../../entities/user";

const deleteUser = async (userId: number) => {
  const userRepository = getRepository(User);
  const user = await userRepository.findOne(userId);
  if (!user) {
    throw new Error("User not found!");
  }
  await userRepository.delete(userId);
  return user;
};

export { deleteUser };
