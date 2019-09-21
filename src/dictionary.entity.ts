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

  @Column({
    type: 'enum',
    enum: Levels,
    default: Levels.FOUR,
  })
  level: Levels;

}
