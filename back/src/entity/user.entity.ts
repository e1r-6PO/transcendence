import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
      unique: true
  })
  logName: string;

  @Column({ default: true })
  isActive: boolean;
}
