import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, Res, HttpCode, UseInterceptors, UploadedFile, UseGuards, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express'
import { fstat } from 'fs';
import multer, { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path/posix';
import { LightChannel } from 'src/entity/lightChannel.entity';
import { Relationship } from 'src/entity/relationship.entity';
import { User } from 'src/entity/user.entity';
import { HasNickGuard, TwoFaGuard, ValidTokenGuard } from 'src/guards/account.guards';
import { ImageUpload } from 'src/middleware/image.upload.middleware';
import { AchievementsService } from 'src/service/achievements.service';
import { ChannelService } from 'src/service/channel.service';
import { ProfileService } from 'src/service/profile.service';
import { UsersService } from 'src/service/users.service';
import { ActiveGateway } from 'src/webSocket/active.gateway';
import { Repository } from 'typeorm';


@Controller('api/profile')
@UseGuards(ValidTokenGuard, TwoFaGuard)
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly achievementService: AchievementsService,
    private readonly channelService: ChannelService,
    @InjectRepository(Relationship)
    private readonly relationShipRepository : Repository<Relationship>,
    private readonly activeGateway: ActiveGateway,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  @Get('me')
  @UseGuards(HasNickGuard)
  me(@Req() request: Request) {
    return this.profileService.me(request)
  }

  @Get('me/nickname')
  get_nickname(@Req() request: Request) {
    return this.profileService.get_nickname(request);
  }

  @Post('me/nickname')
  set_nickname(@Req() request : Request, @Query('nickname') nick) {
    return this.profileService.set_nickname(request, nick);
  }

  @Post('me/picture')
  @UseGuards(HasNickGuard)
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: process.env.DATADIR + '/image_tmp',
      filename: new ImageUpload().editFileName
    }),
    fileFilter: new ImageUpload().imageFileFilter
  }))
  async uploadedFile(@UploadedFile() file: Express.Multer.File, @Req() request: Request) {
    const sharp = require('sharp')
    const fs = require('fs')

    sharp.cache(false)
    await sharp(file.path)
      .resize({width: 750, height: 750})
      .png()
      .toFile(process.env.DATADIR + '/users/' + request.cookies['user_id'] + '.png')
    fs.unlinkSync(file.path)

    var user: User = await this.userRepository.findOne({where: { id: request.cookies['user_id'] }})
    this.activeGateway.server.emit('stateChanged', user.toLightuser())
    return true
  }

  @Post('me/paddleColor')
  @UseGuards(HasNickGuard)
  async changepaddlecolor(@Req() request: Request, @Query('color') color: string) {
    var colorlist = [ ['red'], 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'pink' ]

    var achievement = await this.achievementService.getOneByTitle('God of Pong', request.cookies['user_id'])
    if (achievement && achievement.count >= achievement.goal)
      colorlist.push("white")

    if (!colorlist.find(acolor => acolor == color))
      throw new ForbiddenException()
    this.profileService.changepaddle(request, color)
  }

  @Get('me/picture')
  @UseGuards(HasNickGuard)
  seeUploadedFile(@Req() req: Request, @Res() res) {
    return res.sendFile(req.cookies['user_id'] + '.png', { root: process.env.DATADIR + '/users' });
  }

  @Get('me/friends')
  @UseGuards(HasNickGuard)
  async getFriends(@Req() req: Request) {
    var friend_list = await this.relationShipRepository.find({
      where: { user: req.cookies['user_id'] }
    })

    return friend_list.sort((a, b) => (a.peer.nickName > b.peer.nickName ? 1 : -1))
  }

  @Get('me/channels')
  async getMyChannel(@Req() req: Request)
  {
    var me = await this.channelService.findUserById(req.cookies['user_id'])

    var participantList = await this.channelService.findUserChannels(me)

    var channList: Array<LightChannel> = []
    for (var i = 0; i < participantList.length; i++)
      channList.push(participantList[i].channel.toLightChannel())
    return { "channel": channList }
  }

  @Get('me/achievements')
  async getMyAchievements(@Req() req: Request, @Query('filter') filter) {
    return await this.achievementService.getAchievements(req.cookies['user_id'], filter)
  }
}
