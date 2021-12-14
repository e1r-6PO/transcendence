import { Controller, Post, Body, Patch, Param, Delete, Req, Query, Res, HttpCode, UseInterceptors, UploadedFile, UseGuards, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { query, Request } from 'express'
import { TwoFaGuard, ValidTokenGuard } from 'src/guards/account.guards';
import { JoinTable, Repository } from 'typeorm';
import { Channel } from 'src/entity/channel.entity';
import { User } from 'src/entity/user.entity';
import { ChannelParticipant, ChannelStatus } from 'src/entity/channelParticipant.entity';
import { use } from 'passport';

@Controller('api/chat')
@UseGuards(ValidTokenGuard, TwoFaGuard)
export class ChannelController {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>,
    @InjectRepository(ChannelParticipant)
    private readonly channelParticipantsRepository: Repository<ChannelParticipant>
  ) {}

  @Post('create')
  async createChannel(@Query() query, @Req() req: Request): Promise<void>
  {
    var channel: Channel = await this.channelsRepository.findOne(
      { where :
        { channName: query['name'] }
      }
    );
    if (channel != null)
      throw new ConflictException('Channel exist')
    
    var owner: User = await this.usersRepository.findOne(
      { where :
          { id: req.cookies['user_id'] }
      }
    );

    channel = new Channel();
    var participant: ChannelParticipant = new ChannelParticipant()
    
    channel.channName = query['name']
    channel.channType = query['type']
    
    participant.status = ChannelStatus.owner;
    participant.user = owner;

    channel.channelParticipant = [participant]
    channel = await this.channelsRepository.save(channel)
    participant.channel = channel
    this.channelParticipantsRepository.save(participant)
  }

  @Post('join')
  async joinChannel(@Query() query, @Req() req: Request)
  {
    var channel = await this.channelsRepository.findOne({
      where : { channName: query['name'] }
    });
    if (channel == null)
      throw new ForbiddenException('Channel inexist')

    var user: User = await this.usersRepository.findOne({
      where : { id: req.cookies['user_id'] }
    });

    var ret = await this.channelParticipantsRepository.findOne({
      where : { user: user.id, channel: channel.id }
    });
    if (ret != null)
      throw new ConflictException('Already in channel')
    var participant: ChannelParticipant = new ChannelParticipant()

    participant.status = ChannelStatus.default
    participant.user = user
    participant.channel = channel

    this.channelParticipantsRepository.save(participant)
    return { message: "success" }
  }
}