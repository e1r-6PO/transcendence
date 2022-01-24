import { LightUser } from "./User";

export enum ChannelUserStatus {
  OWNER = 'owner',
  ADMINISTRATOR = 'administrator',
  DEFAULT = 'default'
}
class ChannelUser {

    constructor() {
      this.id = 0;
      this.isMute = false;
      this.muteTime = new Date();
      this.isBan = false;
      this.banTime = new Date();
      this.channelStatus = ChannelUserStatus.DEFAULT;
      this.user = new LightUser()
    }

    id: number;
    channelStatus: ChannelUserStatus;
    user: LightUser;
    isMute: boolean;
    muteTime: Date;
    isBan: boolean;
    banTime: Date;
}

export { ChannelUser }