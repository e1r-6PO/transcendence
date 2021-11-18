import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;
  @Column({ nullable: true })
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

  @Column({ nullable: true })
  public twoFactorAuthenticationSecret?: string;

  @Column({ default: false})
  public isTwoFactorAuthenticationEnabled: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  gameWin: number;

  @Column()
  gameLose: number;
}
