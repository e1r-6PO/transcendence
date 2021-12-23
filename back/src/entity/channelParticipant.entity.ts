import { channel } from "diagnostics_channel";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";
import { Channel } from "./channel.entity";
import { User } from "./user.entity";

export enum ChannelStatus {
  owner = "owner",
  administrator = "administrator",
  default = "default"
}

@Entity()
export class ChannelParticipant {
  constructor() {
    this.banTime = new Date();
    this.muteTime = new Date();
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Channel, channel => channel.channelParticipant, { eager: true, onDelete: "CASCADE", nullable: true})
  channel: Channel;

  @ManyToOne(() => User, { eager: true, onDelete: "CASCADE" })
  user: User;

  @Column({ default: ChannelStatus.default })
  status: ChannelStatus;

  @Column({ default: false })
  isMute: boolean;

  @Column()
  muteTime: Date;

  @Column({ default: false })
  isBan: boolean;

  @Column()
  banTime: Date;
}