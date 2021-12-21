import { Entity } from "typeorm";
import { ChannelStatus } from "./channelParticipant.entity";

@Entity()
export class ChannelUser {
  
  constructor() {
    this.id = 0;
    this.nickName = '';
    this.isMute = false;
    this.muteTime = new Date();
    this.channelStatus = ChannelStatus.default;
    this.picture = '';
  }

  id: number;

  nickName: string;

  channelStatus: string;

  isMute: boolean;

  muteTime: Date;

  picture: string;
}