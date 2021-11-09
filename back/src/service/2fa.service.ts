import { Injectable } from "@nestjs/common";
import { authenticator } from "otplib";
import { User } from "src/entity/user.entity";
import { UsersService } from "./users.service";
import { toFileStream } from 'qrcode';
import { Response } from "express";

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(
    private readonly usersService : UsersService
  ) {}
  public async generateTwoFactorAuthenticationSecret(user : User) {
    
    const secret = authenticator.generateSecret();

    const otpauthurl = authenticator.keyuri(user.email, 'Transcendancix', secret)

    await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id)

    return {
      secret,
      otpauthurl
    }
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  public isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthenticationSecret
    })
  }

}