import { ForbiddenException, HttpException, HttpStatus, Injectable, NestMiddleware, Redirect, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Response, Request, NextFunction, response } from "express";
import { User } from "src/entity/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class ValidTokenMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      await this.jwtService.verifyAsync(req.cookies['jwt'])
    }
    catch (e) 
    {
      throw new UnauthorizedException
    }
    next()
  }
}

@Injectable()
export class AddUserIdMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.cookies['jwt'] != null)
      req.cookies['user_id'] = this.jwtService.decode(req.cookies['jwt'])['id']
    next()
  }
}

@Injectable()
export class HasNickMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    ///si le boug dans la bdd na pas de pseudo alors throw error
    var user : User = await this.usersRepository.findOne(    //ptet moyen de mettre ca ailleur nan ?
      { where:
          { id: req.cookies['user_id'] }
      }
    );

    if (!user || user.nickName == "")
      throw new ForbiddenException
    next()
  }
}
