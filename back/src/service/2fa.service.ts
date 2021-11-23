import { Injectable } from "@nestjs/common";
import { authenticator } from "otplib";
import { User } from "src/entity/user.entity";
import { UsersService } from "./users.service";
import { toFileStream, toDataURL } from 'qrcode';
import { response, Response } from "express";
import { Stream } from "stream";

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(
    private readonly usersService : UsersService
  ) {}
  public async generateTwoFactorAuthenticationSecret(user : User) {
    
    const secret = authenticator.generateSecret();

    const otpauthurl = authenticator.keyuri(user.email, 'Tronscendence', secret)

    await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id)

    return {
      secret,
      otpauthurl
    }
  }

  public async pipeQrCodeStream(res: Response, otpauthUrl: string) {
    res.setHeader('content-type','image/png');
    res.end(await toDataURL(otpauthUrl))
    return res
  }

  public isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthenticationSecret
    })
  }

}