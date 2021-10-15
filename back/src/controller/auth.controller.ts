import { Body, Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/service/auth.service';
import { AuthGuard } from '@nestjs/passport'
import { Response } from 'express';

@Controller ('api/auth/google')
export class AuthController {
    constructor(
      private readonly authService: AuthService
    ) {}

    @Get()
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {}

    @Get('callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res({ passthrough: true}) response : Response) {
      return await this.authService.googleLogin(req, response)
    }
}
