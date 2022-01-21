import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TwoFaGuard, ValidTokenGuard } from 'src/guards/account.guards';
import { AchievementsService } from 'src/service/achievements.service';

@Controller('api/achievements')
@UseGuards(ValidTokenGuard, TwoFaGuard)
export class AchievementsController {

  constructor(
    private achievementsService: AchievementsService,
  )
  {}

  @Get()
  async getAllAchievements() {
    return this.achievementsService.getAllAchievement()
  }
}