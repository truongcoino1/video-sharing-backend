import { deleteUser } from "./delete";
import { getUsers, findIfAllCondition, findIfOneCondition } from "./get";
import { createUser, createUserByDeviceId, createUserSocialMedia } from "./create";
import { updateUser, updateUserInfo } from "./update";

export default {
  createUserByDeviceId,
  createUser,
  createUserSocialMedia,
  updateUserInfo,
  updateUser,
  findIfOneCondition,
  findIfAllCondition,
  getUsers,
  deleteUser,
};
