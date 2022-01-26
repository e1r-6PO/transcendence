import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt';
import { existsSync } from 'fs'
import { Request } from 'express'
import { ActiveGateway } from 'src/webSocket/active.gateway';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService : JwtService,
    private readonly activeGateway: ActiveGateway
  ) {}

  async me(request) {
    // console.log(request.cookies['jwt'])
    var user = await this.usersRepository.findOne(
      { where:
          { id: request.cookies['user_id'] }
      }
    );
    return user;
  }

  async get_nickname(request)
  {
    var user = await this.usersRepository.findOne(
      { where:
          { id: this.jwtService.decode(request.cookies['jwt'])['id'] }
      }
    );
    return { "nickname": user.nickName }
  }

  async changepaddle(request: Request, color: string) {
    this.usersRepository.update({id: request.cookies['user_id']}, { paddleColor: color })
    return { "message" : "success" }
  }

  async set_nickname(request, nick : string) {
    if (nick == null || nick.length == 0 || nick.length > 20)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    var user = await this.usersRepository.findOne(
      { where:
        { nickName: nick }
      }
    );
    if (user)
      throw new HttpException('Nick already exist', HttpStatus.CONFLICT)
    user = await this.usersRepository.findOne(
      { where:
          { id: request.cookies['user_id'] }
      }
    );
    user.nickName = nick
    await this.usersRepository.save(user)

    this.activeGateway.server.emit('stateChanged', user.toLightuser())

    return { "nickname" : user.nickName }
  }
}
