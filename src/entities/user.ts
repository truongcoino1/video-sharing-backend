import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GameData } from "./gameData";
import { Token } from "./token";
import { UserMeta } from "./userMeta";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @Column({ nullable: true })
  avatar?: string | null;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  nation?: string;

  @Column({ nullable: true })
  advertiserId?: string;

  @Column({ nullable: true })
  facebookId?: string;

  @Column({ nullable: true })
  dataOtherGame?: string;

  @Column({ nullable: true })
  guestId?: string;

  @Column({ nullable: true })
  os?: string;

  @Column({ default: false })
  isBlackList?: boolean;

  @Column({ default: "user" })
  role?: "admin" | "user";

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt?: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt?: Date;

  @OneToMany(() => UserMeta, (userMeta) => userMeta.user) userMeta?: UserMeta[];

  @OneToMany(() => GameData, (gameData) => gameData.user) gameData?: GameData[];

  @OneToMany(() => Token, (token) => token.user, { onDelete: "CASCADE" }) tokens?: Token[];
}
