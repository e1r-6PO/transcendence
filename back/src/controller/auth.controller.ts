import { Body, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/service/auth.service';
import { AuthGuard } from '@nestjs/passport'
import { User } from 'src/entity/user.entity';

@Controller ('api/auth/google')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get()
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {}

    @Get('callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req) {
      return await this.authService.googleLogin(req)
    }
}