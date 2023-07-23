import { getRepository, SelectQueryBuilder } from "typeorm";
import configs from "../../../configs";
import { Board } from "../../../entities/board";
import { Game } from "../../../entities/game";
import { User } from "../../../entities/user";
import { Period, SORTBY } from "../../../types/type.filter";
import { Pagination } from "../../../types/type.pagination";

const getUsers = async (filter: {
  pagination: Pagination;
  sort: { [key: string]: SORTBY };
  user: User;
  period: Period;
  game: Game;
  board: Board;
}) => {
  const { pagination, sort, user, period } = filter;
  const userRepository = getRepository(User);
  const query = userRepository.createQueryBuilder("u");
  query.select(["u.id", "u.email", "u.name", "u.createdAt", "u.updatedAt"]);
  query.leftJoinAndSelect("u.gameData", "gd");
  makeQueryWithBoardId(query, filter.board);
  makeQueryWithGameId(query, filter.game);
  makeQueryWithFieldsOfUser(query, user);
  makeQueryWithPeriod(query, period);
  makeQueryWithSort(query, sort);
  query.skip(pagination.offset || 0).take(pagination.limit || configs.MAX_RECORDS_PER_REQ);
  return await query.getMany();
};

const makeQueryWithBoardId = (query: SelectQueryBuilder<User>, board: Board) => {
  if (board.id) {
    query.andWhere("gd.boardId = :boardId", { boardId: board.id });
  }
};

const makeQueryWithGameId = (query: SelectQueryBuilder<User>, game: Game) => {
  if (game.id) {
    query.innerJoin("gd.board", "b");
    query.andWhere("b.gameId = :gameId", { gameId: game.id });
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

export { getUsers, findIfOneCondition, findIfAllCondition };
