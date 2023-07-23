import { getRepository } from "typeorm";
import { Board } from "../../../entities/board";
import { GameData } from "../../../entities/gameData";

const refreshBoard = async () => {
  const expiredBoards = await getExpiredBoards();
  await backupExpiredBoards(expiredBoards);
};

const getExpiredBoards = async () => {
  const boardRepo = getRepository(Board);
  const oneDayAgo = getDaysAgo(1);
  const sevenDaysAgo = getDaysAgo(7);
  const thirtyDaysAgo = getDaysAgo(30);
  const oneYearAgo = getDaysAgo(365);
  const expiredBoards = await boardRepo
    .createQueryBuilder("b")
    .orWhere("(b.resetType = 'daily' and b.startedAt < :dailyExpiredDate and b.isHistory = false)", {
      dailyExpiredDate: oneDayAgo,
    })
    .orWhere("(b.resetType = 'weekly' and b.startedAt < :weeklyExpiredDate and b.isHistory = false)", {
      weeklyExpiredDate: sevenDaysAgo,
    })
    .orWhere("(b.resetType = 'monthly' and b.startedAt < :monthlyExpiredDate and b.isHistory = false)", {
      monthlyExpiredDate: thirtyDaysAgo,
    })
    .orWhere("(b.resetType = 'yearly' and b.startedAt < :yearlyExpiredDate and b.isHistory = false)", {
      yearlyExpiredDate: oneYearAgo,
    })
    .getMany();
  return expiredBoards;
};

const backupExpiredBoards = async (expiredBoards: Board[]) => {
  const boardRepo = getRepository(Board);
  const gameDataRepo = getRepository(GameData);
  expiredBoards.forEach(async (board) => {
    const cloneBoard = getCloneBoard(board);
    await boardRepo.save(cloneBoard);
    const gameDataList = await gameDataRepo.find({ where: { boardId: board.id } });
    gameDataList.forEach(async (gameData) => {
      gameData.boardId = cloneBoard.id;
      await gameDataRepo.update(gameData.id, gameData);
    });
    board.startedAt = new Date();
    boardRepo.update(board.id, board);
  });
};

const getCloneBoard = (board: Board) => {
  const newBoard = new Board();
  let key: keyof Board;
  for (key in board) {
    newBoard[key] = board[key] as never;
  }
  newBoard.isHistory = true;
  newBoard.fromId = board.id;
  delete newBoard.id;
  delete newBoard.createdAt;
  delete newBoard.updatedAt;
  return newBoard;
};

const getDaysAgo = (days: number) => {
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);
  return daysAgo;
};

export default { refreshBoard };
