import { HttpException, HttpStatus, Injectable, NestMiddleware, Redirect } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Response, Request, NextFunction } from "express";

@Injectable()
export class LogMiddleware implements NestMiddleware {
    constructor(
        private jwtService: JwtService
    ) {}
    async use(req: Request, res: Response, next: NextFunction) {
        try {
            await this.jwtService.verifyAsync(req.cookies['jwt'])
        } catch (e) 
        {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
        }
        if (await this.jwtService.decode(req.cookies['jwt'])['nick'] === "")
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
        next()
    }
}
