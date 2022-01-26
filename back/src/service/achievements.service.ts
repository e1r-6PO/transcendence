import { Injectable, Query } from "@nestjs/common";
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

  async getAchievements(id: number, filter: string) {
    var list = await this.achievementsRepository.find({
      where: { user: id }
    })
    if (filter == "completed")
      list = list.filter(el => el.count >= el.goal)
    return list
  }

  async createChannelAchievement(user: User) {
    var achievement = await this.getOneAchievement(user, 1)

    if (achievement == null)
      this.createAchievement(user, 1)
    else
      this.updateAchievement(user, achievement, 1)
  }

  async addFriendAchievement(user: User) {
    var achievement = await this.getOneAchievement(user, 8)

    var model = this.achievements.list[8]
    if (achievement == null)
      this.createAchievement(user, 8)
    else
      this.updateAchievement(user, achievement, 8)
  }

  async sendMsgAchievement(user: User, ) {
    var achievement = await this.getOneAchievement(user, 9)

    var model = this.achievements.list[9]
    if (achievement == null)
      this.createAchievement(user, 9)
    else
      this.updateAchievement(user, achievement, 9)
  }

  async twoFaAchievement(user: User) {
    var achievement = await this.getOneAchievement(user, 10)

    var model = this.achievements.list[10]
    if (achievement == null)
      this.createAchievement(user, 10)
    else
      this.updateAchievement(user, achievement, 10)
  }

  async firstRankAchievement(user: User) {
    var achievement = await this.getOneAchievement(user, 11)

    var model = this.achievements.list[11]
    if (achievement == null)
      this.createAchievement(user, 11)
    else
      this.updateAchievement(user, achievement, 11)
  }

  async playGameAchievement(user: User) {
    var achievement: Array<Achievements> =
      await this.achievementsRepository.find({
        where: [{ action: this.achievements.list[2].action, user: user },
        { action: this.achievements.list[3].action, user: user },
        { action: this.achievements.list[4].action, user: user }]
      })
    
    if (achievement.length == 0)
    {
      var model = this.achievements.list[2]
      var play10Games = new Achievements(user, model.action, model.title, 1, model.goal, model.icon)
      model = this.achievements.list[3]
      var play100Games = new Achievements(user, model.action, model.title, 1, model.goal, model.icon)
      model = this.achievements.list[4]
      var play1000Games = new Achievements(user, model.action, model.title, 1, model.goal, model.icon)
      this.achievementsRepository.save([play10Games, play100Games, play1000Games])
    }
    else
    {
      for (var i = 0; i < achievement.length; i++)
        achievement[i].count += 1
      this.achievementsRepository.save(achievement)
      
      // this.updateAchievement(user, achievement, 5)  
    }
  }

  async winGameAchievement(user: User) {
    var achievement: Array<Achievements> =
    await this.achievementsRepository.find({
      where: [{ action: this.achievements.list[5].action, user: user },
      { action: this.achievements.list[6].action, user: user },
      { action: this.achievements.list[7].action, user: user }]
    })
  
    if (achievement.length == 0)
    {
      var model = this.achievements.list[5]
      var play10Games = new Achievements(user, model.action, model.title, 1, model.goal, model.icon)
      model = this.achievements.list[6]
      var play100Games = new Achievements(user, model.action, model.title, 1, model.goal, model.icon)
      model = this.achievements.list[7]
      var play1000Games = new Achievements(user, model.action, model.title, 1, model.goal, model.icon)
      this.achievementsRepository.save([play10Games, play100Games, play1000Games])
    }
    else
    {
      for (var i = 0; i < achievement.length; i++)
        achievement[i].count += 1
      this.achievementsRepository.save(achievement)
    }
  }

  async getOneAchievement(user: User, id: number): Promise<Achievements> {
    var achievement = await this.achievementsRepository.findOne({
      where : { action: this.achievements.list[id].action, user: user }
    })
    return achievement
  }

  updateAchievement(user: User, achievement: Achievements, id: number) {
    var model = this.achievements.list[id]
    achievement.count += 1
      this.achievementsRepository.update({
        user: user, action: model.action
      }, {
          count: achievement.count
      }) 
  }

  createAchievement(user: User, id: number) {
    var model = this.achievements.list[id]
    var newAchievement = new Achievements(user, model.action, model.title, 1, model.goal, model.icon)
    this.achievementsRepository.save(newAchievement)
  }
}