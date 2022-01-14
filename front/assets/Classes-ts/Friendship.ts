import { LightUser } from "./User";

export enum FriendshipStatus {
  COMPLETED = "completed",
  SENT = "sent",
  INCOMMING = "incomming",
  BLOCKED = "blocked",
}
class Friendship {

    constructor() {
      this.id = 0;
      this.peer = new LightUser();
      this.status = FriendshipStatus.INCOMMING;
    }

    id: number;
    status: FriendshipStatus;
    peer: LightUser;
}

export { Friendship }