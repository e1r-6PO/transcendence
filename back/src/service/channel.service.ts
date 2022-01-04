import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel } from "src/entity/channel.entity";
import { ChannelParticipant } from "src/entity/channelParticipant.entity";
import { Messages } from "src/entity/messages.entity";
import { Relationship } from "src/entity/relationship.entity";
import { User } from "src/entity/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Messages)
    private messagesRepository: Repository<Messages>,
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
    @InjectRepository(ChannelParticipant)
    private readonly channelParticipantsRepository: Repository<ChannelParticipant>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async getAllMessageInChannel(name: string, blocked: Array<number>): Promise<Array<Messages>>
  {
    var messagesArray: Array<Messages> = [];
    var chann : Channel = new Channel();

    chann = await this.channelsRepository.findOne({
      where: { channName: name }
    });

    if (chann == null)
      return null
    
    messagesArray = await this.messagesRepository.find({
        where: { channel: chann }
    })
    for (var i = 0; i < messagesArray.length; i++)
    {
      if (blocked.includes(messagesArray[i].sender.id))
      {
        messagesArray.splice(i, 1)
        i = i > 0 ? i - 1 : 0;
      }
    }
    for (var i = 0; i < messagesArray.length; i++)
        messagesArray[i].senderNick = messagesArray[i].sender.nickName
    return (messagesArray)
  }

  async findChannel(channName: string)
  {
    var channel = await this.channelsRepository.findOne({
      where: { channName: channName }
    })
    if (!channel)
      throw new NotFoundException('Channel ' + channName + ' does not exist')
    return channel
  }

  async findParticipant(userToFind : User, channel)
  {
    var participant = await this.channelParticipantsRepository.findOne({
      where: { user: userToFind, channel: channel}
    })
    if (!participant)
      throw new NotFoundException('User ' + userToFind.nickName + ' not in channels')
    return participant
  }

  async isParticipantexist(userToFind : User, channel)
  {
    var participant = await this.channelParticipantsRepository.findOne({
      where: { user: userToFind, channel: channel}
    })
    return participant
  }

  async findUserById(userId)
  {
    var user = await this.usersRepository.findOne({
      where: { id: userId }
    })
    if (!user)
      throw new NotFoundException('User does not exist')
    return user
  }

  async findUserByNick(userName: string)
  {
    var user = await this.usersRepository.findOne({
      where: { nickName: userName }
    })
    if (!user)
      throw new NotFoundException('User ' + userName + ' does not exist')
    return user
  }

  async findUserChannels(me: User) {
    return await this.channelParticipantsRepository.find({
      where: { user: me }
    })
  }

  checkChannName(channName: string) {
    for (var i = 0; i < channName.length; i++)
      if (channName[i] > ' ' && channName[i] <= '~') 
        return true
    return false
  }

  formatChannName(channName: string) {
    channName = channName.trim()
    channName = channName.replace(/\s\s+/g, ' ');
    return channName
  }
}