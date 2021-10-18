import { Body, Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/service/auth.service';
import { AuthGuard } from '@nestjs/passport'
import { Response } from 'express';
import { request } from 'express';

@Controller ('api/auth')
export class AuthController {
    constructor(
      private readonly authService: AuthService
    ) {}

    // google call
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {}

    // google callback
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res({ passthrough: true}) response : Response) {
      return await this.authService.googleLogin(req, response)
    }

    // 42 call
    @Get('42')
    @UseGuards(AuthGuard('42'))
    async qdauth(@Req() req) {}
  
    // 42 callback
    @Get('42/callback')
    @UseGuards(AuthGuard('42'))
    async qdAuthRedirect(@Req() req, @Res({ passthrough: true}) response : Response) {
      return await this.authService.qdLogin(req, response)
    }

    // logout the user
    @Get('logout')
    @Redirect('/')
    async logout(@Req() req, @Res({ passthrough: true}) response : Response) {
      return await this.authService.logout(req, response)
    }
}
