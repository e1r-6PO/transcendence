import { Controller, Post, Body, Patch, Param, Delete, Req, Query, Res, HttpCode, UseInterceptors, UploadedFile, UseGuards, ConflictException, ForbiddenException, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { query, Request } from 'express'
import { TwoFaGuard, ValidTokenGuard } from 'src/guards/account.guards';
import { JoinTable, Repository } from 'typeorm';
import { ChannAccess, Channel, ChannType } from 'src/entity/channel.entity';
import { User } from 'src/entity/user.entity';
import { ChannelParticipant, ChannelStatus } from 'src/entity/channelParticipant.entity';
import { use } from 'passport';
import * as bcrypt from 'bcrypt';
import { ChannelService } from 'src/service/channel.service';
import { Friend_Status, Relationship } from 'src/entity/relationship.entity';

@Controller('api/chat')
@UseGuards(ValidTokenGuard, TwoFaGuard)
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>,
    @InjectRepository(ChannelParticipant)
    private readonly channelParticipantsRepository: Repository<ChannelParticipant>,
    @InjectRepository(Relationship)
    private readonly relationShipRepository: Repository<Relationship>
  ) {}

  @Get(':name/type')
  async getChannelType(@Param('name') param, @Req() req: Request)
  {
    var channel = await this.channelsRepository.findOne({
      where: { channName: param }
    });
    if (channel == null)
      throw new ConflictException('Channel does not exist')
    return channel.channAccess
  }

  @Get('myChannel')
  async getMyChannel(@Req() req: Request)
  {
    var me = await this.usersRepository.findOne({
      where: { id: req.cookies['user_id'] }
    });

    var participantList = await this.channelParticipantsRepository.find({
      where: { user: me }
    });

    var channList: Array<String> = []
    for (var i = 0; i < participantList.length; i++)
      channList.push(participantList[i].channel.channName)
    return channList
  }


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
    
    if (query['name'].length > 20)
      throw new ConflictException('Channel name is to long')
    var owner: User = await this.usersRepository.findOne(
      { where :
          { id: req.cookies['user_id'] }
      }
    );

    if (query['type'] == ChannAccess.PROTECTED && query['pass'].length < 5)
      throw new ConflictException('Pass is to short')
    
    var hash = await bcrypt.hash(query['pass'], 10)

    channel = new Channel();
    var participant: ChannelParticipant = new ChannelParticipant()
    
    channel.channName = query['name']
    channel.channAccess = query['type']
    channel.channType = ChannType.CHANNEL
    channel.channPass = hash;
    
    participant.status = ChannelStatus.owner;
    participant.user = owner;

    // channel.channelParticipant = [participant]
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
    
    var isMatch = bcrypt.compareSync(query['pass'], channel.channPass) 
    if (channel.channAccess == ChannAccess.PROTECTED && !isMatch)
      throw new ForbiddenException('Wrong password')

    var participant: ChannelParticipant = new ChannelParticipant()

    participant.status = ChannelStatus.default
    participant.user = user
    participant.channel = channel

    this.channelParticipantsRepository.save(participant)
    return { message: "success" }
  }

  @Get(':channName/messages')
  async get_messages(@Param('channName') param, @Req() req : Request)
  {
    var me: User = await this.usersRepository.findOne({
      where : { id: req.cookies['user_id'] }
    });

    var blocked_relation = await this.relationShipRepository.find({
      where: { user: me, status: Friend_Status.blocked }
    })

    var blocked: Array<number> = []
    for (var i = 0; i < blocked_relation.length; i++)
    {
      var tmp: User = await this.usersRepository.findOne({
        where : { id: blocked_relation[i].peer.id }
      });
      blocked.push(tmp.id)
    }
    return this.channelService.getAllMessageInChannel(param, blocked)
  }
}