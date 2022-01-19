import { channel, Channel } from 'diagnostics_channel';
import { ColumnNumericOptions } from 'typeorm/decorator/options/ColumnNumericOptions';
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
    collation: "utf8mb4_bin",
    charset: "utf8mb4"
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

  @Column({ default: false })
  isActive: boolean;

  @Column("decimal", {default: 1500, precision: 12 + 4, scale: 4})
  elo: number

  @Column()
  gameWin: number;

  @Column()
  gameLose: number;

  @Column({default: "cyan"})
  paddleColor: string;

  @OneToMany(() => ChannelParticipant, channelParticipant => channelParticipant.user, { cascade: true })
  channelParticipant: ChannelParticipant[];

  toLightuser() {
    return {
      id: this.id,
      picture: 'http://localhost:8000/api/users/' + this.id + '/picture',
      nickName: this.nickName,
      elo: this.elo,
      gameWin: this.gameWin,
      gameLose: this.gameLose,
      isActive: this.isActive,
      paddleColor: this.paddleColor
    }
  }
}
