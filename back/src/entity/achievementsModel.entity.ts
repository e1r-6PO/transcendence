import { Entity } from "typeorm";

@Entity()
export class AchievementModel {
  constructor(action: string, title: string, goal: number, icon: string) {
    this.action = action
    this.title = title
    this.goal = goal
    this.icon = icon
  }
  
  action: string;
  title: string;
  icon: string;
  goal: number;
}
