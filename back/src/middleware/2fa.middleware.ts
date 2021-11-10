import { ForbiddenException, Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request } from "express";

@Injectable()
export class TwoFaMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {

    var jwt = this.jwtService.decode(req.cookies['jwt'])

    if (jwt['has2fa'] == true && jwt['is2factorauthenticated'] == false)
      throw new ForbiddenException('2fa hasnt been authenticated yet')
    next()
  }
}