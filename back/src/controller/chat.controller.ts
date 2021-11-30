import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, Res, HttpCode, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express'
import { Relationship } from 'src/entity/relationship.entity';
import { HasNickGuard, TwoFaGuard, ValidTokenGuard } from 'src/guards/account.guards';
import { UsersService } from 'src/service/users.service';
import { Repository } from 'typeorm';
import { Messages } from 'src/entity/messages.entity'

@Controller('api/chat')
@UseGuards(ValidTokenGuard, TwoFaGuard)
export class ChatController {
  constructor(
    @InjectRepository(Messages)
    private readonly MessagesRepository : Repository<Messages>
  ) {}

  @Get('messages')
  async get_messages(@Req() req : Request)
  {
      var messagesArray: Array<Messages> = [];

      messagesArray = await this.MessagesRepository.find()
      console.log(messagesArray)
      return (messagesArray)
  }
}