import { getRepository, SelectQueryBuilder } from "typeorm";
import configs from "../../configs";
import { Board } from "../../entities/board";
import { Pagination } from "../../types/type.pagination";

const getBoards = async (params: { pagination: Pagination; filter: Board }) => {
  const gameRepo = getRepository(Board);
  const query = gameRepo.createQueryBuilder("g");
  makeQueryAnd(query, params.filter);
  query.skip(params.pagination?.offset ?? 0);
  query.take(params.pagination?.limit ?? configs.MAX_RECORDS_PER_REQ);
  return await query.getMany();
};

const makeQueryAnd = (query: SelectQueryBuilder<Board>, filter: Board) => {
  let key: keyof Board;
  for (key in filter) {
    if (filter[key]) {
      query.andWhere(`g.${key} = :${key}`, { [key]: filter[key] });
    }
  }
};

export default { getBoards };
