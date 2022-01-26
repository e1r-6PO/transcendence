import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Request, request } from "express";
import { identity } from "rxjs";
import { Friend_Status, Relationship } from "src/entity/relationship.entity";
import { TwoFaGuard, ValidTokenGuard } from "src/guards/account.guards";
import { AchievementsService } from "src/service/achievements.service";
import { FriendsService } from "src/service/friends.service";
import { PrivateMessageService } from "src/service/privateMessage.service";
import { UsersService } from "src/service/users.service";
import { Repository } from "typeorm";

@Controller('api/friends')
@UseGuards(ValidTokenGuard, TwoFaGuard)
export class FriendsController {
  constructor(
    private readonly achievementsService: AchievementsService,
    private readonly privateMessagesService : PrivateMessageService,
    private readonly usersService : UsersService,
    private readonly friendsService : FriendsService,
    @InjectRepository(Relationship)
    private relationShipRepository : Repository<Relationship>
  ) {}

  // Get friends
  @Get(':id')
  async getFriend(@Param('id') id, @Req() req: Request) {
    let relation : Relationship | null = await this.relationShipRepository.findOne({
      where: { user: req.cookies['user_id'], peer: id }
    })
    if (!relation)
      return { status: "null" }
    return { status: relation.status }
  }

  // Create a friend request
  @Post(':id')
  async addFriend(@Param('id') id, @Req() req: Request) {
    let sender = null as Relationship 
    let receiver = null as Relationship //mettre la verif dans unguard

    sender = await this.friendsService.find_sender(req.cookies['user_id'], id)
    receiver = await this.friendsService.find_receiver(req.cookies['user_id'], id)

    if (id == req.cookies['user_id']
      || sender != null
      || receiver != null)
    {
      throw new ForbiddenException
    }
    this.friendsService.create_friend_request(req.cookies['user_id'], id);
    return { message: "success" }
  }

  // Accept a friend request
  @Patch(':id/accept')
  async accept(@Param('id') id, @Req() req: Request) {
    let sender = null as Relationship 
    let receiver = null as Relationship //mettre la verif dans unguard

    sender = await this.friendsService.find_sender(req.cookies['user_id'], id)
    receiver = await this.friendsService.find_receiver(req.cookies['user_id'], id)

    if (id == req.cookies['user_id']
      || sender == null
      || receiver == null
      || sender.status != Friend_Status.incomming)
    {
      throw new ForbiddenException
    }

    this.friendsService.accept_friend_request(sender, receiver);
    this.achievementsService.addFriendAchievement(receiver.user)
    return { message: "success" }
  }

  // deny la friend request
  // supprimer le mecs des amis
  // annuler la friend request
  @Delete(':id')
  async delete_relationship(@Param('id') id, @Req() req: Request) {
    let sender = null as Relationship
    let receiver = null as Relationship //mettre la verif dans unguard

    sender = await this.friendsService.find_sender(req.cookies['user_id'], id)
    receiver = await this.friendsService.find_receiver(req.cookies['user_id'], id)

    if (id == req.cookies['user_id']
      || sender == null
      || receiver == null)
    {
      throw new ForbiddenException
    }
    if (receiver.status == Friend_Status.blocked)
      throw new ForbiddenException
    else
      this.friendsService.delete_relationship(sender, receiver);
  
    return { message: "success" }
  }

  // bloquer qq1
  @Post(':id/block')
  async blockFriend(@Param('id') id, @Req() req: Request) {
    let sender = null as Relationship 
    let receiver = null as Relationship //mettre la verif dans unguard

    sender = await this.friendsService.find_sender(req.cookies['user_id'], id)
    receiver = await this.friendsService.find_receiver(req.cookies['user_id'], id)

    if (id == req.cookies['user_id']) {
      throw new ForbiddenException
    }

    if (sender != null)
      this.relationShipRepository.delete(sender);
    if (receiver != null && receiver.status != Friend_Status.blocked)
      this.relationShipRepository.delete(receiver);

    this.friendsService.create_block(req.cookies['user_id'], id);
    this.privateMessagesService.createServMp("You has been blocked", req.cookies['user_id'], id)
    this.privateMessagesService.createServMp("You blocked this user", id, req.cookies['user_id'])
    return { message: "success" }
  }

  @Post(':id/unblock')
  async unblockFriend(@Param('id') id, @Req() req: Request) {
    let sender = null as Relationship 

    sender = await this.friendsService.find_sender(req.cookies['user_id'], id)

    if (id == req.cookies['user_id']
      || sender == null
      || sender.status != Friend_Status.blocked) {
      throw new ForbiddenException
    }

    this.relationShipRepository.delete(sender);
    this.privateMessagesService.createServMp("You has been unblocked", req.cookies['user_id'], id)
    this.privateMessagesService.createServMp("You unblocked this user", id, req.cookies['user_id'])

    return { message: "success" }
  }
}