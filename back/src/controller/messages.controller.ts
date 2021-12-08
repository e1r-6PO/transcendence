import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, Res, HttpCode, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express'
import { Relationship } from 'src/entity/relationship.entity';
import { HasNickGuard, TwoFaGuard, ValidTokenGuard } from 'src/guards/account.guards';
import { UsersService } from 'src/service/users.service';
import { Repository } from 'typeorm';
import { Messages } from 'src/entity/messages.entity'
import { MessagesService } from 'src/service/messages.service';

@Controller('api/chat')
@UseGuards(ValidTokenGuard, TwoFaGuard)
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    @InjectRepository(Messages)
    private readonly MessagesRepository : Repository<Messages>
  ) {}

  @Get('messages')
  async get_messages(@Req() req : Request)
  {
      return this.messagesService.getAll()
  }
}