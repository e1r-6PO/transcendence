import { ClassSerializerInterceptor, Controller, Get, Injectable, Post, Req, Res, UseInterceptors } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Request, Response } from "express";
import { User } from "src/entity/user.entity";
import { TwoFactorAuthenticationService } from "src/service/2fa.service";
import { Repository } from "typeorm";

@Controller('api/2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService : TwoFactorAuthenticationService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  @Get('generate')
  async register(@Res() response: Response, @Req() req : Request) {

    var user = await this.usersRepository.findOne(
      { where:
          { id: req.cookies['user_id'] }
      }
    );

    const { otpauthurl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(user)

    return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthurl)
  }
}