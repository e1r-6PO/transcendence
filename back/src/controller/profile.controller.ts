import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, Res, HttpCode } from '@nestjs/common';
import { Request, Response } from 'express'
import { ProfileService } from 'src/service/profile.service';

@Controller('api/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  me(@Req() request: Request) {
    return this.profileService.me(request)
  }

  @Get('me/nickname')
  get_nickname(@Req() request: Request) {
    return this.profileService.get_nickname(request);
  }

  @Post('me/nickname')
  set_nickname(@Req() request : Request, @Query('nickname') nick) {
    return this.profileService.set_nickname(request, nick);
  }
}
