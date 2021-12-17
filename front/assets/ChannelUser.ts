export enum ChannelUserStatus {
  OWNER = 'owner',
  ADMINISTRATOR = 'administrator',
  DEFAULT = 'DEFAULT'
}
class ChannelUser {

    constructor() {
      this.id = 0;
      this.nickName = '';
      this.isMute = false;
      this.muteTime = new Date();
      this.channelStatus = ChannelUserStatus.DEFAULT;
      this.picture = ''
    }

    id: number;
    nickName: string;
    isMute: boolean;
    muteTime: Date;
    channelStatus: ChannelUserStatus;
    picture: string;
}

export { ChannelUser }