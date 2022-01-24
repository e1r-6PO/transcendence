import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, Res, HttpCode, UseGuards, ForbiddenException } from '@nestjs/common';
import { UsersService } from 'src/service/users.service';
import { Request, Response } from 'express'
import { HasNickGuard, TwoFaGuard, ValidTokenGuard } from 'src/guards/account.guards';
import { Friend_Status, Relationship } from 'src/entity/relationship.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendsService } from 'src/service/friends.service';
import { AchievementsService } from 'src/service/achievements.service';
import { ActiveGateway } from 'src/webSocket/active.gateway';

@Controller('api/stats')
@UseGuards(ValidTokenGuard, TwoFaGuard, HasNickGuard)
export class StatsController {

  constructor(
    private readonly activeGateway: ActiveGateway
  ) {}

  @Get()
  async serverstats() {
    let data = {
      'playerOnline': await (await this.activeGateway.server.allSockets()).size
    }

    return data
  }
}