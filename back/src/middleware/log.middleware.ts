import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Response, Request, NextFunction } from "express";

@Injectable()
export class LogMiddleware implements NestMiddleware {
    constructor(
        private jwtService: JwtService
    ) {}
    async use(req: Request, res: Response, next: NextFunction) {
        
        if (req.cookies['jwt'] == null || await this.jwtService.verifyAsync(req.cookies['jwt']) == null)
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
        else
            next()
    }
}
