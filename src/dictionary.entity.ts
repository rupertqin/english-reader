import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

export enum Levels {
  FOUR = 4,
  SIX = 6,
  EIGHT = 8
}

@Entity()
export class Dictionary {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true })
  word: string;

  @Column()
  desc: string;

  @Column({nullable: true})
  youdao: string;

  @Column({ type: "text", nullable: true })
  pronounce: string;

  @Column({
    type: 'enum',
    enum: Levels,
    default: Levels.FOUR,
  })
  level: Levels;

  @Column({ type: "simple-array", nullable: true })
  alias;

}
