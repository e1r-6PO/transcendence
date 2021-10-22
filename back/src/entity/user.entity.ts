import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;
  @Column()
  displayName: string;
  @Column()
  picture: string;

  @Column({
    //  unique: true
  })
  nickName: string;

  @Column()
  provider: string;
  @Column()
  provider_id: string;

  @Column({ default: true })
  isActive: boolean;
}
