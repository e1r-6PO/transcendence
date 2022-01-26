import { Controller, ForbiddenException, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { query, Request } from 'express'
import { InjectRepository } from "@nestjs/typeorm";
import { PrivateMessage } from "src/entity/privateMessage.entity";
import { User } from "src/entity/user.entity";
import { TwoFaGuard, ValidTokenGuard } from "src/guards/account.guards";
import { Repository } from "typeorm";
import { PrivateMessageService } from "src/service/privateMessage.service";
import { Friend_Status, Relationship } from "src/entity/relationship.entity";

@Controller('api/mp')
@UseGuards(ValidTokenGuard, TwoFaGuard)
export class PrivateMessageController {
  constructor(
    private readonly privateMessageService: PrivateMessageService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(PrivateMessage)
    private readonly MessagePrivateRepository: Repository<PrivateMessage>,
    @InjectRepository(Relationship)
    private readonly relationShipRepository: Repository<Relationship>
  ) {}

  @Get(':user/messages')
  async joinPrivateMessage(@Param('user') userName, @Req() req: Request)
  {
    var userToTalk = await this.privateMessageService.findUserByNick(userName)
    var user = await this.privateMessageService.findUserById(req.cookies['user_id'])

    var relation = await this.relationShipRepository.findOne({
      where: [
        { user: user.id, peer: userToTalk.id },
        { user: userToTalk.id, peer: user.id }
      ]
    })
    var allMessages
    if (relation && relation.status == Friend_Status.blocked)
      allMessages = await this.MessagePrivateRepository.find({
        where:
          { target: user, sender: userToTalk, type: "server" }
      })
    else
      allMessages = await this.MessagePrivateRepository.find({
        where: [
          { target: user, sender: userToTalk, type: "message" },
          { target: user, sender: userToTalk, type: "game" },
          { sender: user, target: userToTalk, type: "message" },
          { sender: user, target: userToTalk, type: "game" },
          { target: user, sender: userToTalk, type: "server" }
        ]
      })
    
    return allMessages
  }
}