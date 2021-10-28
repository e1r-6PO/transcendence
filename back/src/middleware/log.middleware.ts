import { HttpException, HttpStatus, Injectable, NestMiddleware, Redirect } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Response, Request, NextFunction } from "express";
import { User } from "src/entity/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class LogMiddleware implements NestMiddleware {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}
    async use(req: Request, res: Response, next: NextFunction) {
        try {
            await this.jwtService.verifyAsync(req.cookies['jwt'])
        } catch (e) 
        {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
        }
        var user = await this.usersRepository.findOne(
            { where:
                { id: this.jwtService.decode(req.cookies['jwt'])['id'] }
            }
        )
        ///si le boug dans la bdd na pas de pseudo alors throw error
        if ((await this.usersRepository.findOne(
            { where:
                { id: this.jwtService.decode(req.cookies['jwt'])['id'] }
            }
        )).nickName == "")
            throw new HttpException('Forbidden', HttpStatus.FAILED_DEPENDENCY)
        next()
    }
}
