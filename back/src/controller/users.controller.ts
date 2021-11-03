import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, Res, HttpCode } from '@nestjs/common';
import { UserService } from 'src/service/users.service';
import { Request, Response } from 'express'

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':nick')
  findOne(@Param('nick') nick: string) {
    return this.userService.findOne(nick);
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
