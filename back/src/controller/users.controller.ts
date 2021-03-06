import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, Res, HttpCode, UseGuards, ForbiddenException } from '@nestjs/common';
import { UsersService } from 'src/service/users.service';
import { Request, Response } from 'express'
import { HasNickGuard, TwoFaGuard, ValidTokenGuard } from 'src/guards/account.guards';
import { Friend_Status, Relationship } from 'src/entity/relationship.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendsService } from 'src/service/friends.service';
import { AchievementsService } from 'src/service/achievements.service';

@Controller('api/users')
@UseGuards(ValidTokenGuard, TwoFaGuard, HasNickGuard)
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly achievementService: AchievementsService,
    @InjectRepository(Relationship)
    private readonly relationShipRepository : Repository<Relationship>,
    private readonly friendsService: FriendsService
  ) {}

  @Get('search')
  find(@Query('nick') nick: string) {
    return this.userService.search(nick)
  }

  @Get(':hint')
  getbyhint(@Param('hint') hint: string) {
    return this.userService.findOne(hint);
  }

  @Get(':id/picture')
  seeUploadedFile(@Param('id') id: number, @Req() req: Request, @Res() res) {
    return res.sendFile(id + '.png', { root: process.env.DATADIR + '/users' });
  }

  @Get(':id/matchs')
  getmatchhistory(@Param('id') id, @Query('offset') offset: number, @Query('count') count: number) {
    return this.userService.getMatchHistory(id, (offset == null ? 0 : offset), ((count == null ? 10 : count)))
  }


  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: User) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get(':id/achievements')
  async getAchievements(@Param('id') id, @Query('filter') filter) {

    return await this.achievementService.getAchievements(id, filter)

  }
}
