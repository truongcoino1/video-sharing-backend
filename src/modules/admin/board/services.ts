import { getRepository, SelectQueryBuilder } from "typeorm";
import configs from "../../../configs";
import { Board } from "../../../entities/board";
import CustomError from "../../../errors/customError";
import { Pagination } from "../../../types/type.pagination";

const createBoard = async (board: Board) => {
  const boardRepo = getRepository(Board);
  const newBoard = await boardRepo.save(board);
  return newBoard;
};

const updateBoard = async (id: number, board: Board) => {
  const findBoards = await getBoards({ pagination: { limit: 1, offset: 0 }, filter: { id } });
  if (!findBoards.length) {
    throw new CustomError(400, "Board not found!");
  }
  const boardRepo = getRepository(Board);
  await boardRepo.update(id, board);
  return {
    ...findBoards[0],
    board,
  };
};

const getBoards = async (params: { pagination: Pagination; filter: Board }) => {
  const boardRepo = getRepository(Board);
  const query = boardRepo.createQueryBuilder("b");
  makeQueryAnd(query, params.filter);
  query.skip(params.pagination?.offset ?? 0);
  query.take(params.pagination?.limit ?? configs.MAX_RECORDS_PER_REQ);
  return await query.getMany();
};

const makeQueryAnd = (query: SelectQueryBuilder<Board>, filter: Board) => {
  let key: keyof Board;
  for (key in filter) {
    if (filter[key] !== undefined && filter[key] !== null) {
      query.andWhere(`b.${key} = :${key}`, { [key]: filter[key] });
    }
  }
};

const deleteBoard = async (id: number) => {
  const findBoards = await getBoards({ pagination: { limit: 1, offset: 0 }, filter: { id } });
  if (!findBoards.length) {
    throw new CustomError(400, "Board not found!");
  }
  const boardRepo = getRepository(Board);
  await boardRepo.delete(id);
  return findBoards[0];
};

export default { getBoards, createBoard, updateBoard, deleteBoard };
