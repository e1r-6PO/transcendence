import { channel, Channel } from 'diagnostics_channel';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { ChannelParticipant } from './channelParticipant.entity';

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

  @OneToMany(() => ChannelParticipant, channelParticipant => channelParticipant.user, { cascade: true })
  channelParticipant: ChannelParticipant[];
}
