import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel } from "src/entity/channel.entity";
import { Messages } from "src/entity/messages.entity";
import { Repository } from "typeorm";

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Messages)
    private MessagesRepository: Repository<Messages>,
    @InjectRepository(Channel)
    private ChannelsRepository: Repository<Channel>
  ) {}

  async getAllMessageInChannel(name: string): Promise<Array<Messages>>
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

    for (var i = 0; i < messagesArray.length; i++)
    {
        messagesArray[i].senderNick = messagesArray[i].sender.nickName
    }
    return (messagesArray)
  }
}