import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, Res, HttpCode, UseInterceptors, UploadedFile, UseGuards, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { query, Request, Response } from 'express'
import { HasNickGuard, TwoFaGuard, ValidTokenGuard } from 'src/guards/account.guards';
import { Repository } from 'typeorm';
import { Messages } from 'src/entity/messages.entity'
import { ChannelParticipant } from 'src/entity/channelParticipant.entity';
import { Channel } from 'src/entity/channel.entity';
import { User } from 'src/entity/user.entity';

@Controller('api/chat')
@UseGuards(ValidTokenGuard, TwoFaGuard)
export class MessagesController {
  constructor(
    @InjectRepository(Messages)
    private readonly MessagesRepository : Repository<Messages>,
    @InjectRepository(ChannelParticipant)
    private readonly ChannelParticipantRepository : Repository<ChannelParticipant>,
    @InjectRepository(Channel)
    private readonly ChannelRepository : Repository<Channel>,
  ) {}

  // @Get('messages/:name')
  // async get_messages(@Param('name') param, @Req() req : Request)
  // {
  //   var me: User = await this.usersRepository.findOne({
  //     where : { id: req.cookies['user_id'] }
  //   });
  //   return this.messagesService.getAllMessageInChannel(param)
  // }

  @Get('messages/access')
  async checkAccess(@Query() query, @Req() req : Request)
  {
    var channel = await this.ChannelRepository.findOne({
      where: { channName: query['name'] }
    })
    if (channel == null)
      throw new NotFoundException()

    var ret = this.ChannelParticipantRepository.findOne({
      where: { user: req.cookies['user_id'],
              channel: channel
      }
    })
    if (ret == null)
      throw new ForbiddenException()
    return {status: "success"}
  }
}