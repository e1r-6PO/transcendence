import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PrivateMessage } from "src/entity/privateMessage.entity";
import { User } from "src/entity/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class PrivateMessageService {
  constructor(
    @InjectRepository(PrivateMessage)
    private messagesRepository: Repository<PrivateMessage>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

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

  // async getAllMessageInChannel(name: string, blocked: Array<number>): Promise<Array<Messages>>
  // {
  //   var messagesArray: Array<PrivateMessage> = [];

  //   messagesArray = await this.messagesRepository.find({
  //       where: { channel: cha }
  //   })
  //   for (var i = 0; i < messagesArray.length; i++)
  //   {
  //     if (blocked.includes(messagesArray[i].sender.id))
  //     {
  //       messagesArray.splice(i, 1)
  //       i = i > 0 ? i - 1 : 0;
  //     }
  //   }
  //   for (var i = 0; i < messagesArray.length; i++)
  //       messagesArray[i].senderNick = messagesArray[i].sender.nickName
  //   return (messagesArray)
  // }
}