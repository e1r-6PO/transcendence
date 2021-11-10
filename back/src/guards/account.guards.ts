import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { User } from 'src/entity/user.entity';
import { UsersService } from 'src/service/users.service';

@Injectable()
export class TwoFaGuard implements CanActivate {
  constructor(
    private usersService : UsersService  
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    
    var user : User = await this.usersService.getUser(request)

    return true;
  }
}

@Injectable()
export class ValidTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    try {
      await this.jwtService.verifyAsync(request.cookies['jwt'])
    }
    catch (e) 
    {
      throw new ForbiddenException
    }
    return true
  }
}

@Injectable()
export class HasNickGuard implements CanActivate {
  constructor(
    private usersService : UsersService
  ) {}
  async canActivate(context : ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    ///si le boug dans la bdd na pas de pseudo alors throw error
    var user : User = await this.usersService.getUser(request)

    if (!user || user.nickName == "")
      throw new ForbiddenException
    return true
  }
}
