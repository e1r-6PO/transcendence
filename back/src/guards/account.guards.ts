import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { User } from 'src/entity/user.entity';
import { UsersService } from 'src/service/users.service';

@Injectable()
export class TwoFaFileGuard implements CanActivate {
  constructor(
    private usersService : UsersService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const user = await this.usersService.getUser(request)

    switch(context.getHandler().name) {

      case "is_enabled": { return true }
      
      case "generate": {
        if (!(user.isTwoFactorAuthenticationEnabled))
          return true
        return false
      }

      // turn-on endpoint
      case "turnOnTwoFactorAuthentication": {
        if (!(user.isTwoFactorAuthenticationEnabled) && user.twoFactorAuthenticationSecret != null)
          return true
        return false
      }

      // turn-off endpoint
      case "turnOffTwoFactorAuthentication": {
        if (user.isTwoFactorAuthenticationEnabled && user.twoFactorAuthenticationSecret != null)
          return true
        return false
      }
    
      case "authenticate": {
        if (user.isTwoFactorAuthenticationEnabled && user.twoFactorAuthenticationSecret != null)
          return true
        return false
      }
      default: { return false }
    }
  }
}

@Injectable()
export class TwoFaGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    var jwt = this.jwtService.decode(request.cookies['jwt'])

    if (jwt['has2fa'] == true && jwt['is2factorauthenticated'] == false)
      throw new ForbiddenException('2fa hasnt been authenticated yet')
    return true
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
