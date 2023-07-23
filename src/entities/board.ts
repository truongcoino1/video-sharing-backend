import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./game";
import { GameData } from "./gameData";

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @Column()
  gameId?: number;

  @Column({ default: false })
  isHistory?: boolean;

  @Column({ default: null, nullable: true })
  fromId?: number;

  @Column({ default: "monthly" })
  resetType?: "daily" | "weekly" | "monthly" | "yearly";

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt?: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt?: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  startedAt?: Date;

  @OneToMany(() => GameData, (gameData) => gameData.board, { onDelete: "CASCADE" }) gameData?: GameData[];

  @ManyToOne(() => Game, (game) => game.boards, { onDelete: "CASCADE" }) game?: Game;
}
