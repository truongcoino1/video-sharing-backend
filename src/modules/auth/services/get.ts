import { getRepository } from "typeorm";
import { User } from "../../../entities/user";

const findIfOneCondition = async (user: User) => {
  const userRepository = getRepository(User);
  let key: keyof User;
  let query = userRepository.createQueryBuilder("u");
  for (key in user) {
    if (user[key]) {
      query.orWhere(`u.${key} = :${key}`, { [key]: user[key] });
    }
  }
  return await query.getOne();
};

const findIfAllCondition = async (user: User) => {
  const userRepository = getRepository(User);
  let key: keyof User;
  let query = userRepository.createQueryBuilder("u");
  for (key in user) {
    if (user[key]) {
      query.andWhere(`u.${key} = :${key}`, { [key]: user[key] });
    }
  }
  return await query.getOne();
};

export { findIfOneCondition, findIfAllCondition };
