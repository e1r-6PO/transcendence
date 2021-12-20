import { Controller, Post, Body, Patch, Param, Delete, Req, Query, Res, HttpCode, UseInterceptors, UploadedFile, UseGuards, ConflictException, ForbiddenException, Get, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { query, Request } from 'express'
import { TwoFaGuard, ValidTokenGuard } from 'src/guards/account.guards';
import { JoinTable, Repository } from 'typeorm';
import { ChannAccess, Channel, ChannType } from 'src/entity/channel.entity';
import { User } from 'src/entity/user.entity';
import { ChannelParticipant, ChannelStatus } from 'src/entity/channelParticipant.entity';
import passport, { use } from 'passport';
import * as bcrypt from 'bcrypt';
import { ChannelService } from 'src/service/channel.service';
import { Friend_Status, Relationship } from 'src/entity/relationship.entity';
import { ChannelUser } from 'src/entity/channelUser.entity';

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

  @Get(':channName/type')
  async getChannelType(@Param('channName') channName, @Req() req: Request)
  {
    var channel = await this.channelsRepository.findOne({
      where: { channName: channName }
    });
    if (channel == null)
      throw new ConflictException('Channel does not exist')
    return channel.channAccess
  }

  @Get(':channName/me')
  async getMyInfo(@Param('channName') channName, @Req() req: Request)
  {
    console.log("coucou")
    var channel = await this.channelsRepository.findOne({
      where: { channName: channName }
    })
    if (channel == null)
      throw new NotFoundException()

    var participant = await this.channelParticipantsRepository.findOne({
      where: { user: req.cookies['user_id'], channel: channel }
    })
    if (participant == null)
      throw new NotFoundException()
    return participant
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

  @Get(':channName/users')
  async getChannelUsers(@Param('channName') param, @Req() req: Request)
  {
    var channel = await this.channelsRepository.findOne({
      where: { channName: param }
    });
    if (channel == null)
      throw new ConflictException('Channel does not exist')
    
    var checkAccess = this.channelParticipantsRepository.findOne({
      where: { user: req.cookies['user_id'], channel: channel }
    });

    if (checkAccess == null)
      throw new ForbiddenException()

      var participantList = await this.channelParticipantsRepository.find({
      where : { channel: channel }
    });

    var usersList = []
    for (var i = 0; i < participantList.length; i++)
    {
      var user: ChannelUser = new ChannelUser()
      user.nickName = participantList[i].user.nickName
      user.id = participantList[i].user.id
      user.channelStatus = participantList[i].status
      user.isMute = participantList[i].isMute
      user.muteTime = participantList[i].muteTime
      user.picture = participantList[i].user.picture
      usersList.push(user)
    }
    return usersList
  }

  @Post(':channName/create')
  async createChannel(@Param('channName') channName, @Req() req: Request): Promise<void>
  {
    var channel: Channel = await this.channelsRepository.findOne(
      { where :
        { channName: channName }
      }
    );
    if (channel != null)
      throw new ConflictException('Channel exist')
    
    if (channName.length > 20)
      throw new ConflictException('Channel name is to long')
    var owner: User = await this.usersRepository.findOne(
      { where :
          { id: req.cookies['user_id'] }
      }
    );

    if (query['type'] == ChannAccess.PROTECTED && query['pass'].length < 5)
      throw new ConflictException('Pass is to short')
    
    if (query['pass'])
      var hash = await bcrypt.hash(query['pass'], 10)
    else
      var hash = ""

    channel = new Channel();
    var participant: ChannelParticipant = new ChannelParticipant()
    
    channel.channName = channName
    channel.channAccess = query['type']
    channel.channType = ChannType.CHANNEL
    channel.channPass = hash;
    
    participant.status = ChannelStatus.owner;
    participant.user = owner;

    channel.channelParticipant = [participant]
    channel = await this.channelsRepository.save(channel)
    participant.channel = channel
    this.channelParticipantsRepository.save(participant)
  }

  @Post(':channName/join')
  async joinChannel(@Query('pass') pass, @Param('channName') channName, @Req() req: Request)
  {
    var channel = await this.channelsRepository.findOne({
      where : { channName: channName }
    });
    if (channel == null)
      throw new ForbiddenException('Channel inexist')

    var participant = await this.channelParticipantsRepository.findOne({
      where : { user: req.cookies['user_id'], channel: channel.id }
    });

    if (participant != null)
      throw new ConflictException('Already in channel')
    
    var isMatch = null
    if (channel.channAccess == ChannAccess.PROTECTED && pass != "")
      isMatch = bcrypt.compareSync(pass, channel.channPass) 
    if (channel.channAccess == ChannAccess.PROTECTED && !isMatch)
      throw new ForbiddenException('Wrong password')

    var user = await this.usersRepository.findOne({
      where: { id: req.cookies['user_id'] }
    })

    var newParticipant: ChannelParticipant = new ChannelParticipant()

    console.log(channel)
    console.log(user)
    newParticipant.status = ChannelStatus.default
    newParticipant.user = user
    newParticipant.channel = channel

    this.channelParticipantsRepository.save(newParticipant)
    return { message: "success" }
  }

  @Post(':channName/leave')
  async leaveChannel(@Param('channName') channName, @Req() req: Request)
  {
    var channel = await this.channelsRepository.findOne({
      where : { channName: channName }
    })
    if (channel == null)
      throw new NotFoundException()

    var participant = await this.channelParticipantsRepository.findOne({
      where: { user: req.cookies['user_id'], channel: channel } 
    })
    if (participant == null)
      throw new ForbiddenException('Not in channel')

    this.channelParticipantsRepository.remove(participant)
  }

  @Get(':channName/messages')
  async get_messages(@Param('channName') param, @Req() req : Request)
  {
    var blocked_relation = await this.relationShipRepository.find({
      where: { user: req.cookies['user_id'], status: Friend_Status.blocked }
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

  @Get(':channName/access')
  async checkAccess(@Param('channName') channName, @Req() req : Request)
  {
    var channel = await this.channelsRepository.findOne({
      where: { channName: channName }
    })
    if (channel == null)
      throw new NotFoundException()

    var ret = this.channelParticipantsRepository.findOne({
      where: { user: req.cookies['user_id'],
              channel: channel
      }
    })
    if (ret == null)
      throw new ForbiddenException()
    return {status: 201}
  }
}