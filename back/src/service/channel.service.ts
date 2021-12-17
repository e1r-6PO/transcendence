import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel } from "src/entity/channel.entity";
import { Messages } from "src/entity/messages.entity";
import { Relationship } from "src/entity/relationship.entity";
import { User } from "src/entity/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Messages)
    private MessagesRepository: Repository<Messages>,
    @InjectRepository(Channel)
    private ChannelsRepository: Repository<Channel>
  ) {}

  async getAllMessageInChannel(name: string, blocked: Array<number>): Promise<Array<Messages>>
  {
    var messagesArray: Array<Messages> = [];
    var chann : Channel = new Channel();

    chann = await this.ChannelsRepository.findOne({
      where: { channName: name }
    });

    if (chann == null)
      return null
    
    messagesArray = await this.MessagesRepository.find({
        where: { channel: chann }
    })
    console.log(blocked)
    for (var i = 0; i < messagesArray.length; i++)
    {
      console.log(blocked.includes(messagesArray[i].sender.id))
      if (blocked.includes(messagesArray[i].sender.id))
      {
        console.log("SPLICE")
        messagesArray.splice(i, 1)
        i = i > 0 ? i - 1 : 0;
      }
    }
    console.log("After :")
    // console.log(messagesArray)
    for (var i = 0; i < messagesArray.length; i++)
    {
        messagesArray[i].senderNick = messagesArray[i].sender.nickName
    }
    return (messagesArray)
  }
}