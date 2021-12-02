import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, Res, HttpCode, UseGuards, ForbiddenException } from '@nestjs/common';
import { UsersService } from 'src/service/users.service';
import { Request, Response } from 'express'
import { HasNickGuard, TwoFaGuard, ValidTokenGuard } from 'src/guards/account.guards';
import { Friend_Status, Relationship } from 'src/entity/relationship.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendsService } from 'src/service/friends.service';

@Controller('api/users')
@UseGuards(ValidTokenGuard, TwoFaGuard, HasNickGuard)
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(Relationship)
    private readonly relationShipRepository : Repository<Relationship>,
    private readonly friendsService: FriendsService
  ) {}

  @Get('search')
  find(@Query('nick') nick: string) {
    return this.userService.search(nick)
  }

  @Get('friend')
  async getFriend(@Query('id') id, @Req() req: Request) {
    let relation : Relationship | null = await this.relationShipRepository.findOne({
      where: { user: req.cookies['user_id'], peer: id }
    })
    if (!relation)
      return { status: "null" }
    return { status: relation.status }
  }

  @Post('friend')
  async addFriend(@Query('id') id, @Body('action') action, @Req() req: Request) {
    let sender = null as Relationship
    let receiver = null as Relationship //mettre la verif dans unguard

    sender = await this.relationShipRepository.findOne({
      where: { user: req.cookies['user_id'], peer: id }
    })
    receiver = await this.relationShipRepository.findOne({
      where: { user: id, peer: req.cookies['user_id'] }
    })

    if (id == req.cookies['user_id'] || (sender == null && receiver != null) || (sender != null && receiver == null)) {
      throw new ForbiddenException
    }

    if (sender == null && receiver == null && action == 'create') {
      this.friendsService.create_friend_request(req.cookies['user_id'], id);
    }
    else {
      if ((sender.status == Friend_Status.completed || sender.status == Friend_Status.sent || sender.status == Friend_Status.incomming) && action == 'delete') {
        this.relationShipRepository.delete(sender)
        this.relationShipRepository.delete(receiver)
      }
      else if (sender.status == Friend_Status.incomming && action == 'accept')
      {
        sender.status = Friend_Status.completed
        receiver.status = Friend_Status.completed
        this.relationShipRepository.save(sender)
        this.relationShipRepository.save(receiver)
      }
    }
  }

  @Get(':hint')
  getbyhint(@Param('hint') hint: string) {
    return this.userService.findOne(hint);
  }

  @Get(':id/picture')
  seeUploadedFile(@Param('id') id: number, @Req() req: Request, @Res() res) {
    return res.sendFile(id + '.png', { root: '../data/users' });
  }


  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: User) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
