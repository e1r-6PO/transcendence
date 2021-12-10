import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Messages } from "src/entity/messages.entity";
import { Repository } from "typeorm";

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Messages)
    private MessagesRepository: Repository<Messages>,
  ) {}

  async getAll(): Promise<Array<Messages>>
  {
    var messagesArray: Array<Messages> = [];

    messagesArray = await this.MessagesRepository.find()

    for (var i = 0; i < messagesArray.length; i++)
    {
        messagesArray[i].senderNick = messagesArray[i].sender.nickName
    }
    return (messagesArray)
  }
}