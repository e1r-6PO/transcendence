import { User } from "./User";

interface IPrivateMessages {
  id: number;
  target: User;
  sender: User;
  message: string;
  picture: string;
  time: Date;

  // relative to a game message
  type: string;
  game_id: string;
  game_state: string;
  winner: User;
}

class PrivateMessages {

  id: number;
  sender: User;
  senderNick: string;
  target: User;
  message: string;
  picture: string;
  time: Date;
  type: string;
  game_id: string;
  game_state: string;
  winner: User;

  constructor();
  constructor(msg: IPrivateMessages);
  constructor(msg?: any)
  {
      this.id = msg && msg.id || 0;
      this.sender = msg && msg.sender || 0;
      this.target = msg && msg.target || "";
      this.message = msg && msg.message || "";
      this.time = msg && msg.time || new Date();
      this.picture = msg && msg.picture || "";
      this.type = msg && msg.type || "message";
      this.game_id = msg && msg.game_id || ""
      this.game_state = msg && msg.game_state || ""
      this.winner = msg && msg.target || "";
      this.senderNick = msg && msg.senderNick || ""
  }
}

export { PrivateMessages }