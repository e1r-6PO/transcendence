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

  async createServMp(msg: string, sender: User, target: User)
  {
    var message = new PrivateMessage()

    message.message = msg
    message.sender = sender
    message.target = target
    message.type = "server"
    this.messagesRepository.save(message)
  }
}