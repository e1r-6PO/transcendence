import { ClassSerializerInterceptor, Controller, Get, Injectable, Post, Query, Req, Res, UnauthorizedException, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { ALPN_ENABLED } from "constants";
import { Request, response, Response } from "express";
import { User } from "src/entity/user.entity";
import { HasNickGuard, TwoFaGuard, ValidTokenGuard } from "src/guards/account.guards";
import { TwoFactorAuthenticationService } from "src/service/2fa.service";
import { UsersService } from "src/service/users.service";
import { Repository } from "typeorm";

@Controller('api/auth/2fa')
@UseGuards(ValidTokenGuard, HasNickGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService : TwoFactorAuthenticationService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersService : UsersService,
    private jwtService : JwtService
  ) {}

  @Get('is_enabled')
  @UseGuards(TwoFaGuard)
  async is_enabled(@Req() req : Request) {

    var user : User = await this.usersService.getUser(req)

    return { isTwoFactorAuthenticationEnabled: user.isTwoFactorAuthenticationEnabled };
  }

  @Get('generate')
  async register(@Res() response: Response, @Req() req : Request) {

    var user : User = await this.usersService.getUser(req)

    const { otpauthurl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(user)

    return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthurl)
  }

  @Get('turn-on')
  async turnOnTwoFactorAuthentication(@Req() req : Request, @Query('2fa') tfa : string) {

    var user : User = await this.usersService.getUser(req)

    const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(tfa, user)

    if (!isCodeValid)
      throw new UnauthorizedException('Wrong auth code')

    await this.usersService.turnOnTwoFactorAuthentication(user.id)
  }

  @Get('authenticate')
  async authenticate(@Req() req : Request, @Res({ passthrough: true}) response : Response, @Query('2fa') tfa : string) {

    var user : User = await this.usersService.getUser(req)

    const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(tfa, user)

    if (!isCodeValid)
      throw new UnauthorizedException('Wrong auth code')

    var jsoninfo = this.jwtService.decode(req.cookies['jwt'])

    var newjwt = {
      id: jsoninfo['id'],
      has2fa: true,
      is2factorauthenticated: true
    }

    response.clearCookie('jwt')
    response.cookie('jwt', await this.jwtService.signAsync(newjwt))

    return { message: "success" }
  }
}