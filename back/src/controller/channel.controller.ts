import { Controller, Post, Body, Patch, Param, Delete, Req, Query, Res, HttpCode, UseInterceptors, UploadedFile, UseGuards, ConflictException, ForbiddenException, Get, NotFoundException, Put } from '@nestjs/common';
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
import { start } from 'repl';
import { Messages, Messages_type } from 'src/entity/messages.entity';
import { AchievementsService } from 'src/service/achievements.service';
// import { ChannelGuard } from 'src/guards/.channel.guards';

@Controller('api/chat')
@UseGuards(ValidTokenGuard, TwoFaGuard)
export class ChannelController {
  constructor(
    private readonly achievementsService: AchievementsService,
    private readonly channelService: ChannelService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>,
    @InjectRepository(ChannelParticipant)
    private readonly channelParticipantsRepository: Repository<ChannelParticipant>,
    @InjectRepository(Messages)
    private readonly messagesRepository: Repository<Messages>,
    @InjectRepository(Relationship)
    private readonly relationShipRepository: Repository<Relationship>
  ) {}

  @Get(':channName/info')
  async getChannelInfo(@Param('channName') channName, @Req() req: Request)
  {
    var channel = await this.channelService.findChannel(channName)
    
    var participant = await this.channelService.findParticipant(req.cookies['user_id'], channel)
      .catch(function(error) {
        return null
      })
    
    var totalUser = await this.channelParticipantsRepository.find({
      where: { channel: channel }
    })
    
    if (participant && participant.status == ChannelStatus.owner)
      return { channName: channel.channName, channAccess: channel.channAccess, channPass: channel.channPass, totalUser: totalUser.length }  
    else
      return { channName: channel.channName, channAccess: channel.channAccess, channPass: "" }
  }

  @Patch(':channName/info')
  async changeInfo(@Query() query,@Param('channName') channName, @Req() req: Request)
  {
    var channel = await this.channelService.findChannel(channName)
    
    var participant = await this.channelService.findParticipant(req.cookies['user_id'], channel)
    if (participant.status != ChannelStatus.owner)
      throw new ForbiddenException("You re not the owner")
    if (!query['channAccess'])
      throw new ForbiddenException("Missing param")
    if (query['channAccess'] == ChannAccess.PROTECTED && !query['channPass'])
      throw new ForbiddenException("Missing param")
      var hash = ""
    if (query['channAccess']== ChannAccess.PROTECTED)
      hash = await bcrypt.hash(query['channPass'], 10)
    this.channelsRepository.update({
      channName: channName
    }, {
      channAccess: query['channAccess'], channPass: hash
    })
  }

  @Get(':channName/me')
  async getMyInfo(@Param('channName') channName, @Req() req: Request)
  {
    var channel = await this.channelService.findChannel(channName)

    var participant = await this.channelService.findParticipant(req.cookies['user_id'], channel)
    return participant.toJSON()
  }

  @Get(':channName/users')
  async getChannelUsers(@Param('channName') channName, @Req() req: Request)
  {
    var channel = await this.channelService.findChannel(channName)
    
    var checkAccess = await this.channelService.findParticipant(req.cookies['user_id'], channel)

    var participantList = await this.channelParticipantsRepository.find({
      where : { channel: channel }
    });
    return participantList
  }

  @Post(':channName/create')
  async createChannel(@Param('channName') channName, @Query() query, @Req() req: Request): Promise<void>
  {
    if (!channName[0] || channName[0] == ' ')
      throw new ConflictException("Channel name can't start with space")
    channName = this.channelService.formatChannName(channName)
    if (!this.channelService.checkChannName(channName))
      throw new ConflictException("Channel name need to have visible character in his name")
    if (channName.length > 20)
      throw new ConflictException('Channel name is to long')
    var channel = await this.channelService.findChannel(channName)
      .catch(function(error) {
        return null
      })
    if (channel)
      throw new ConflictException('Channel already exists')
      
    var owner = await this.channelService.findUserById(req.cookies['user_id'])
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

    var servMsg = new Messages()

    servMsg.sender = owner
    servMsg.type = Messages_type.server
    servMsg.message = "User <" + owner.nickName + "> has created the channel."
    servMsg.channel = channel

    this.achievementsService.createChannelAchievement(owner)
    this.messagesRepository.save(servMsg)
    this.channelParticipantsRepository.save(participant)
  }

  @Post(':channName/join')
  async joinChannel(@Query('pass') pass, @Param('channName') channName, @Req() req: Request)
  {
    var channel = await this.channelService.findChannel(channName)

    var participant = await this.channelService.isParticipantexist(req.cookies['user_id'], channel)
    if (participant != null)
      throw new ConflictException('Already in channel')
    
    if (channel.channAccess == ChannAccess.PRIVATE)
      throw new ForbiddenException(channel.channName + ' is a private channel, nobody can join it')
    
    var isMatch = null
    if (channel.channAccess == ChannAccess.PROTECTED && pass != "")
      isMatch = bcrypt.compareSync(pass, channel.channPass) 
    if (channel.channAccess == ChannAccess.PROTECTED && !isMatch)
      throw new ForbiddenException('Wrong password')

    var user = await this.channelService.findUserById(req.cookies['user_id'])
    var newParticipant: ChannelParticipant = new ChannelParticipant()

    newParticipant.status = ChannelStatus.default
    newParticipant.user = user
    newParticipant.channel = channel

    this.channelParticipantsRepository.save(newParticipant)
    return { message: "success" }
  }

  @Post(':channName/leave')
  async leaveChannel(@Param('channName') channName, @Req() req: Request)
  {
    var channel = await this.channelService.findChannel(channName)
    var participant = await this.channelService.findParticipant(req.cookies['user_id'], channel)
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
      var tmp = await this.channelService.findUserById(blocked_relation[i].peer.id)
      blocked.push(tmp.id)
    }
    return this.channelService.getAllMessageInChannel(param, blocked)
  }

  @Get(':channName/access')
  async checkAccess(@Param('channName') channName, @Req() req : Request)
  {
    var channel = await this.channelService.findChannel(channName)

    var participant = await this.channelService.findParticipant(req.cookies['user_id'], channel)
    if (participant.isBan && participant.banTime.getTime() > new Date().getTime())
      throw new ForbiddenException('You re currently banned until ' + participant.banTime.toString().slice(0,21).replace(/-/g,'/'))
    return {status: 201}
  }

  @Post(':channName/addUser')
  async addUser(@Param('channName') channName, @Query() query, @Req() req: Request)
  {
    if (!query['userName'])
      throw new ForbiddenException('Missing params')
    
    var channel = await this.channelService.findChannel(channName)
    
    var owner = await this.channelService.findParticipant(req.cookies['user_id'], channel)
    if (owner.status != ChannelStatus.owner && owner.status != ChannelStatus.administrator)
      throw new ForbiddenException('Only owner/administrator can add user')
    
    var user = await this.channelService.findUserByNick(query['userName'])
      .catch(function(error) {
        throw new ForbiddenException('User does not exist')
      })
    var isInChann = await this.channelParticipantsRepository.findOne({
      where: { user: user, channel: channel }
    })
    
    var newParticipant = new ChannelParticipant()
    newParticipant.user = user
    newParticipant.channel = channel

    this.channelParticipantsRepository.save(newParticipant)
    return
  }

  @Delete(':channName/deleteUser')
  async deleteUser(@Param('channName') channName, @Query() query, @Req() req: Request)
  {
    if (!query['userName'])
      throw new ForbiddenException('Missing params')
    
    var channel = await this.channelService.findChannel(channName)
    
    var owner = await this.channelService.findParticipant(req.cookies['user_id'], channel)
    if (owner.status != ChannelStatus.owner)
      throw new ForbiddenException('Only owner can delete user')
    
    var user = await this.channelService.findUserByNick(query['userName'])
    var participantToDelete = await this.channelService.findParticipant(user, channel)
    this.channelParticipantsRepository.delete(participantToDelete)
  }

  @Patch(':channName/changeGrade')
  async changeGrade(@Param('channName') channName, @Query() query, @Req() req: Request)
  {
    if (!query['userName'])
      throw new ForbiddenException('Missing params')
    
    var channel = await this.channelService.findChannel(channName)
    
    var owner = await this.channelService.findParticipant(req.cookies['user_id'], channel)
    if (owner.status != ChannelStatus.owner)
      throw new ForbiddenException('Only owner can delete user')
    var user = await this.channelService.findUserByNick(query['userName'])
    var participant = await this.channelService.findParticipant(user, channel)
    var newStatus = participant.status == ChannelStatus.default ? ChannelStatus.administrator : ChannelStatus.default
    
    this.channelParticipantsRepository.update({
        channel: channel, user: user
      }, {
        status: newStatus
    })
  }

  @Patch(':channName/action/:muteOrBan')
  async muteUser(@Param('channName') channName, @Param('muteOrBan') muteOrBan, @Query() query, @Req() req: Request)
  {
    if (muteOrBan != 'ban' && muteOrBan != 'mute')
      throw new ForbiddenException('Param ' + muteOrBan + ' is not valid')
    
    if (!query['userName'] || !query['time'])
      throw new ForbiddenException('Missing params')
    
    var channel = await this.channelService.findChannel(channName)
    
    var admin = await this.channelService.findParticipant(req.cookies['user_id'], channel)
    if (admin.status == ChannelStatus.default)
      throw new ForbiddenException('Only owner or administrator can ' + muteOrBan + ' user')
    
    var user = await this.channelService.findUserByNick(query['userName'])
    var participant = await this.channelService.findParticipant(user, channel)
    var actionTime = new Date(query['time'])
    actionTime.setHours(actionTime.getHours() - 1)
    if (muteOrBan == 'mute')
    {
      var startMute = participant.isMute == true ? false : true
      this.channelParticipantsRepository.update({
          channel: channel, user: user
        }, {
          isMute: startMute, muteTime: startMute == true ? actionTime : new Date()
      })
    }
    else if (muteOrBan == 'ban')
    {
      var startBan = participant.isBan == true ? false : true
      this.channelParticipantsRepository.update({
          channel: channel, user: user
        }, {
          isBan: startBan, banTime: startBan == true ? actionTime : new Date()
      })
    }
  }

  @Patch(':channName/giveOwner')
  async giveOwner(@Param('channName') channName, @Query() query, @Req() req: Request)
  {
    if (!query['userName'])
      throw new ForbiddenException("Missing params")
    var channel = await this.channelService.findChannel(channName)
    var user = await this.channelService.findUserByNick(query['userName'])
    var owner = await this.channelService.findParticipant(req.cookies['user_id'], channel)
    if (owner.status != ChannelStatus.owner)
      throw new ForbiddenException('Only owner can delete user')

    var participant = await this.channelService.findParticipant(user, channel)    
    this.channelParticipantsRepository.update({
        channel: channel, user: user
      }, {
        status: ChannelStatus.owner
    })
    this.channelParticipantsRepository.delete(owner)
  }

  @Delete(':channName/delete')
  async deleteChannel(@Param('channName') channName, @Req() req: Request) {
    
    var channel = await this.channelService.findChannel(channName)
    var user = await this.channelService.findUserById(req.cookies['user_id'])
    var owner = await this.channelService.findParticipant(user, channel)

    if (owner.status != ChannelStatus.owner)
      throw new ForbiddenException("Only owner can delete a channel")
    
    this.channelsRepository.delete(channel)
  }

}