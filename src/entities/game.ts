import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Board } from "./board";

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt?: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt?: Date;

  @OneToMany(() => Board, (board) => board.game, { onDelete: "CASCADE" }) boards?: Board[];
}
