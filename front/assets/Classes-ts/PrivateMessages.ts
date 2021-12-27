import { User } from "./User";

interface IPrivateMessages {
  id: number;
  target: User;
  sender: User;
  message: string;
  picture: string;
  date: Date;
}

class PrivateMessages {

  id: number;
  sender: User;
  target: User;
  message: string;
  picture: string;
  date: Date;

  constructor();
  constructor(msg: IPrivateMessages);
  constructor(msg?: any)
  {
      this.id = msg && msg.id || 0;
      this.sender = msg && msg.sender || 0;
      this.target = msg && msg.target || "";
      this.message = msg && msg.message || "";
      this.date = msg && msg.time || new Date();
      this.picture = msg && msg.picture || "";
  }
}

export { PrivateMessages }