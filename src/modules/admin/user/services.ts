import { getRepository, SelectQueryBuilder } from "typeorm";
import configs from "../../../configs";
import { Board } from "../../../entities/board";
import { Game } from "../../../entities/game";
import { User } from "../../../entities/user";
import CustomError from "../../../errors/customError";
import { Period, SORTBY } from "../../../types/type.filter";
import { Pagination } from "../../../types/type.pagination";

const updateUserInfo = async (userId: number, useData: User) => {
  const userRepo = getRepository(User);
  const findUser = await userRepo.findOne(userId);
  if (!findUser) {
    throw new CustomError(404, "User not found!");
  }
  await userRepo.update(userId, useData);
  return { ...findUser, ...useData };
};

const getUsers = async (filter: {
  pagination: Pagination;
  sort: { [key: string]: SORTBY };
  user: User;
  period: Period;
  game: Game;
  board: Board;
}) => {
  const { pagination, sort, user, period, board, game } = filter;
  const userRepository = getRepository(User);
  const query = userRepository.createQueryBuilder("u");
  query.leftJoinAndSelect("u.gameData", "gd");
  makeQueryWithGameId(query, game);
  makeQueryWithBoardId(query, board);
  makeQueryWithFieldsOfUser(query, user);
  makeQueryWithPeriod(query, period);
  makeQueryWithSort(query, sort);
  query.skip(pagination.offset || 0).take(pagination.limit || configs.MAX_RECORDS_PER_REQ);
  return await query.getMany();
};

const makeQueryWithGameId = (query: SelectQueryBuilder<User>, game: Game) => {
  if (game.id) {
    query.andWhere("b.gameId = :gameId", { gameId: game.id });
  }
};

const makeQueryWithBoardId = (query: SelectQueryBuilder<User>, board: Board) => {
  if (board.id) {
    query.innerJoin("gd.board", "b");
    query.andWhere("gd.boardId = :boardId", { boardId: board.id });
  }
};

const makeQueryWithFieldsOfUser = (query: SelectQueryBuilder<User>, user: User) => {
  let key: keyof User;
  for (key in user) {
    if (user[key]) {
      query.andWhere(`u.${key} = :${key}`, { [key]: user[key] });
    }
  }
};

const makeQueryWithPeriod = (query: SelectQueryBuilder<User>, period: Period) => {
  if (period.startAt && period.endAt) {
    query.andWhere("gd.updatedAt BETWEEN :startAt AND :endAt", {
      startAt: period.startAt,
      endAt: period.endAt,
    });
  }
};

const makeQueryWithSort = (query: SelectQueryBuilder<User>, sort: { [key: string]: SORTBY }) => {
  if (sort.sortGem) {
    query.orderBy("gd.totalGem", sort.sortGem);
  }
  if (sort.sortLevel) {
    query.orderBy("gd.currentLevel", sort.sortLevel);
  }
};

export default { updateUserInfo, getUsers };
