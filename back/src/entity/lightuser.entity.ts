import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LightUser {
  id: number;

  picture: string;

  nickName: string;

  gameWin: number;

  gameLose: number;

  isActive: boolean;
}
