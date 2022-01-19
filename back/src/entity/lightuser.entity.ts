import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LightUser {
  id: number;

  picture: string;

  nickName: string;

  elo: number;

  gameWin: number;

  gameLose: number;

  isActive: boolean;

  paddleColor: string;
}
