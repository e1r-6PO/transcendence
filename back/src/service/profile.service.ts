import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt';
import { existsSync } from 'fs'

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService : JwtService
  ) {}

  async me(request) {
    // console.log(request.cookies['jwt'])
    var user = await this.usersRepository.findOne(
      { where:
          { id: request.cookies['user_id'] }
      }
    );
    if (existsSync('../data/users/' + request.cookies['user_id'] + '.png'))
      user.picture = 'http://localhost:8000/api/profile/me/picture'
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

  async set_nickname(request, nick) {
    if (nick == null || nick.len == 0 || nick.len > 20)
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

    return { "nickname" : user.nickName }
  }
}
