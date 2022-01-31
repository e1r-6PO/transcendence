import { AchievementModel } from "./achievementsModel.entity";

export class AchievementsList {
  constructor() {}

  list = {
    1: new AchievementModel("Create a channel", "Social creator", 1, "mdi-chat-plus"),
    2: new AchievementModel("Play 10 games", "Learner", 10, "mdi-trophy"),
    3: new AchievementModel("Play 100 games", "Casual player", 100, "mdi-trophy-award"),
    4: new AchievementModel("Play 1000 games", "Try harder", 1000, "mdi-diamond-stone"),
    5: new AchievementModel("Win 10 games", "Adam", 10, "mdi-gamepad"),
    6: new AchievementModel("Win 100 games", "Hans sama", 100, "mdi-gamepad-square"),
    7: new AchievementModel("Win 1000 games", "Rekkles", 1000, "mdi-microsoft-xbox-controller"),
    8: new AchievementModel("Add 1 friend", "Don't be alone", 1, "mdi-hand-heart"),
    9: new AchievementModel("Send 100 messages", "Troubadour", 100, "mdi-comment-text-multiple"),
    10: new AchievementModel("Active 2fa", "Cyber protector", 1, "mdi-incognito"),
    11: new AchievementModel("Be the 1 in the ladder", "God of Pong", 1, "mdi-podium-gold"),
  }

  secretList = {
    1: new AchievementModel("Love Arthur so much", "Arthur's fan", 1, "mdi-police-badge"),
    2: new AchievementModel("Be cool, be like Eudald", "Eudald's fan", 1, "mdi-glass-mug-variant"),
    3: new AchievementModel("Please Lucas teach me english", "Lucas's fan", 1, "mdi-human-male-board"),
  }
}