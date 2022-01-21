import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Achievements} from "src/entity/achievements.entity";
import { AchievementsList } from "src/entity/achievementsList.entity";
import { User } from "src/entity/user.entity";
import { Entity, Repository } from "typeorm";

@Injectable()
export class AchievementsService {

  constructor(
    // private achievements: AchievementsList,
    @InjectRepository(Achievements)
    private achievementsRepository: Repository<Achievements>,
  )
  {}

  achievements: AchievementsList = new AchievementsList

  async getMyAchievements(user: User) {
    var list = await this.achievementsRepository.find({
      where: { user: user }
    })

    return list
  }

  getAllAchievement() {
    return new AchievementsList().list
  }

  async createChannelAchievement(user: User) {
    var achievement = await this.achievementsRepository.findOne({
      where : { action: this.achievements.list[1].action, user: user }
    })

    if (achievement == null)
    {
      var newAchievement = new Achievements(user, this.achievements.list[1].action, this.achievements.list[1].title, 1, this.achievements.list[1].goal, "mdi-chat-plus")
      this.achievementsRepository.save(newAchievement)
    }
    else
    {
      achievement.count += 1
      this.achievementsRepository.update({
        user: user, action: this.achievements.list[1].action
      }, {
          count: achievement.count
      }) 
    }
  }

  async addFriendAchievement(user: User) {
    var achievement = await this.achievementsRepository.findOne({
      where : { action: this.achievements.list[8].action, user: user }
    })

    var model = this.achievements.list[8]
    if (achievement == null)
    {
      var newAchievement = new Achievements(user, model.action, model.title, 1, model.goal, "mdi-chat-plus")
      this.achievementsRepository.save(newAchievement)
    }
    else
    {
      achievement.count += 1
      this.achievementsRepository.update({
        user: user, action: model.action
      }, {
          count: achievement.count
      }) 
    }
  }

  async sendMsgAchievement(user: User) {
    var achievement = await this.achievementsRepository.findOne({
      where : { action: this.achievements.list[9].action, user: user }
    })

    var model = this.achievements.list[9]
    if (achievement == null)
    {
      var newAchievement = new Achievements(user, model.action, model.title, 1, model.goal, "mdi-chat-plus")
      this.achievementsRepository.save(newAchievement)
    }
    else
    {
      achievement.count += 1
      this.achievementsRepository.update({
        user: user, action: model.action
      }, {
          count: achievement.count
      }) 
    }
  }
}