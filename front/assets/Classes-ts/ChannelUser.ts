export enum ChannelUserStatus {
  OWNER = 'owner',
  ADMINISTRATOR = 'administrator',
  DEFAULT = 'default'
}
class ChannelUser {

    constructor() {
      this.id = 0;
      this.nickName = '';
      this.isMute = false;
      this.muteTime = new Date();
      this.isBan = false;
      this.banTime = new Date();
      this.channelStatus = ChannelUserStatus.DEFAULT;
      this.picture = ''
      this.isActive = false
      this.currentGame = "";
    }

    id: number;
    channelStatus: ChannelUserStatus;
    nickName: string;
    isMute: boolean;
    muteTime: Date;
    isBan: boolean;
    banTime: Date;
    picture: string;
    isActive: boolean;
    currentGame: string
}

export { ChannelUser }