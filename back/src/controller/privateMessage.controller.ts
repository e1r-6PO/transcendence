import { Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { query, Request } from 'express'
import { InjectRepository } from "@nestjs/typeorm";
import { PrivateMessage } from "src/entity/privateMessage.entity";
import { User } from "src/entity/user.entity";
import { TwoFaGuard, ValidTokenGuard } from "src/guards/account.guards";
import { Repository } from "typeorm";
import { PrivateMessageService } from "src/service/privateMessage.service";

@Controller('api/mp')
@UseGuards(ValidTokenGuard, TwoFaGuard)
export class PrivateMessageController {
  constructor(
    private readonly privateMessageService: PrivateMessageService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(PrivateMessage)
    private readonly MessagePrivateRepository: Repository<PrivateMessage>
  ) {}

  @Get(':user/messages')
  async joinPrivateMessage(@Param('user') userName, @Req() req: Request)
  {
    var userToTalk = await this.privateMessageService.findUserByNick(userName)
    var user = await this.privateMessageService.findUserById(req.cookies['user_id'])

    var allMessages = await this.MessagePrivateRepository.find({
      where: [{ target: user, sender: userToTalk }, { sender: user, target: userToTalk }]
    })
    console.log(allMessages)
    return allMessages
  }
}