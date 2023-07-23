import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Board } from "./board";
import { User } from "./user";

@Entity()
export class GameData {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ default: 0 })
  remainGem?: number;

  @Column({ default: 0 })
  totalGem?: number;

  @Column({ default: 0 })
  currentCoin?: number;

  @Column({ default: 1 })
  currentLevel?: number;

  @Column({ default: 0 })
  countChangeConsecutive?: number;

  @Column({ type: "timestamp", nullable: true })
  blockedTo?: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt?: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt?: Date;

  @Column()
  userId?: number;

  @Column()
  boardId?: number;

  @ManyToOne(() => User, (user) => user.gameData, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user?: User;

  @ManyToOne(() => Board, (board) => board.gameData, { onDelete: "CASCADE" })
  @JoinColumn({ name: "boardId", referencedColumnName: "id" })
  board?: Board;
}
