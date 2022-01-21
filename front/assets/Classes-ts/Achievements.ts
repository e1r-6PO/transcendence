import { User } from "./User";

export enum AchievementsList {
  createChannel = "Create a channel",
  win10Game = "Win 10 games",
  win100Game = "Win 100 games",
  win1000Game = "Win 1000 games",
  play10Game = "Play 10 games",
  play100Game = "Play 100 games",
  play1000Game = "Play 1000 games",
  add1Friend = "Add 1 friend",
  send100Message = "Send 100 messages",
}

export class Achievements {

  constructor();
  constructor(user: User, action: string, title: string, count: number, goal: number);
  constructor(user?: User, action?: string, title?: string, count?: number, goal?: number) {
    this.user = user || new User()
    this.action = action || ""
    this.title = title || ""
    this.count = count || 0
    this.goal = goal || 0
    this.id = 0
  }
  
  id: number;

  user: User;

  action: string;
  
  title: string;

  count: number;

  goal: number;
}