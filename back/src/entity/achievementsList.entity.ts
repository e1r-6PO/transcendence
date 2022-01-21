import { AchievementModel } from "./achievementsModel.entity";

export class AchievementsList {
  constructor() {}

  list = {
    1: new AchievementModel("Create a channel", "Social creator", 1, "mdi-chat-plus"),
    2: new AchievementModel("Win 10 games", "Learner", 10, "mdi-trophy"),
    3: new AchievementModel("Win 100 games", "Casual player", 100, "mdi-trophy-award"),
    4: new AchievementModel("Win 1000 games", "Try harder", 1000, "mdi-diamond-stone"),
    5: new AchievementModel("Play 10 games", "Learner", 10, "mdi-gamepad"),
    6: new AchievementModel("Play 100 games", "Casual player", 100, "mdi-gamepad-square"),
    7: new AchievementModel("Play 1000 games", "Try harder", 1000, "mdi-microsoft-xbox-controller"),
    8: new AchievementModel("Add 1 friend", "Don't be alone", 1, "mdi-hand-heart"),
    9: new AchievementModel("Send 100 messages", "Troubadour", 100, "mdi-comment-text-multiple"),
  }
}