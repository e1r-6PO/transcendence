import { ChannAccess } from "./Messages"

class Channel {
  constructor() {
    this.id = 0
    this.channType = "channel"
    this.channAccess = ChannAccess.PUBLIC
    this.channName = ""
    this.channPass = ""
  }

  id: number
  channName: string

  channPass: string;

  channType: string;

  channAccess: string;
}

export { Channel }