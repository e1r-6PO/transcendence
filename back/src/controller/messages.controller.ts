import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, Res, HttpCode, UseInterceptors, UploadedFile, UseGuards, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { query, Request, Response } from 'express'
import { HasNickGuard, TwoFaGuard, ValidTokenGuard } from 'src/guards/account.guards';
import { Repository } from 'typeorm';
import { Messages } from 'src/entity/messages.entity'
import { MessagesService } from 'src/service/messages.service';

@Controller('api/chat')
@UseGuards(ValidTokenGuard, TwoFaGuard)
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    @InjectRepository(Messages)
    private readonly MessagesRepository : Repository<Messages>,
  ) {}

  @Get('messages/:name')
  async get_messages(@Param('name') param, @Req() req : Request)
  {
      return this.messagesService.getAllMessageInChannel(param)
  }
}