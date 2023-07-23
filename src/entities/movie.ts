import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: false })
  youtube_id?: string;

  @Column({ nullable: true })
  thumbnail?: string;

  @Column({ nullable: false })
  shared_by?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt?: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt?: Date;

  @ManyToOne(() => User, (user) => user.movies, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user?: User;
}
