import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Achievements } from 'src/entity/achievements.entity';
import { AchievementsList } from 'src/entity/achievementsList.entity';
import { TwoFaGuard, ValidTokenGuard } from 'src/guards/account.guards';
import { AchievementsService } from 'src/service/achievements.service';
import { Repository } from 'typeorm';

@Controller('api/achievements')
@UseGuards(ValidTokenGuard, TwoFaGuard)
export class AchievementsController {

  constructor(
    private achievementsService: AchievementsService,
    @InjectRepository(Achievements)
    private readonly achievementsRepository: Repository<Achievements>,
  )
  {}

  @Get()
  async getAllAchievements( @Req() req: Request) {
    return this.achievementsService.getAllAchievement()
  }

  @Get(':title')
  async getOne(@Param('title') title, @Req() req: Request) {

    return this.achievementsService.getOneByTitle(title)
  }
}