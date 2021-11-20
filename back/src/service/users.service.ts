import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Like, Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { existsSync } from 'fs';
import { LightUser } from 'src/entity/lightuser.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService : JwtService
  ) {}

  async findOne(hint: string | number) {
    // await new Promise(r => setTimeout(r, 2000));
    if (typeof hint === "string") {
      var user = await this.usersRepository.findOne(
        { where:
          { nickName: hint }
        }
      );
    }
    // else if (typeof hint === "number") {
    //   var user = await this.usersRepository.findOne(
    //     { where:
    //       { id: hint }
    //     }
    //   );
    // }


    if (!user)
      throw new NotFoundException

    // replace provider picture with custom one
    if (existsSync('../data/users/' + user.id + '.png'))
      user.picture = 'http://localhost:8000/api/users/' + user.id + '/picture'
    
    var filtered : LightUser = {
      id: user.id,
      nickName: user.nickName,
      picture: user.picture,
      gameWin: user.gameWin,
      gameLose: user.gameLose,
    }
    return filtered
  }

  async search(nick: string) {
    var matches = []

    const userResult = await this.usersRepository.find(
      {
        where: { nickName: Like(nick + "%") }
      }
    )
    for (let result of userResult) {
      matches.push(result.nickName)
    }
    return matches
  }

  async getUser(request: Request) {
    var user = await this.usersRepository.findOne(    //ptet moyen de mettre ca ailleur nan ?
      { where:
          { id: request.cookies['user_id'] }
      }
    );
    return user;
  }

  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    return this.usersRepository.update(userId, {
      twoFactorAuthenticationSecret: secret
    })
  }

  async turnOnTwoFactorAuthentication(userId: number) {
    return this.usersRepository.update(userId, {
      isTwoFactorAuthenticationEnabled: true
    })
  }

  async turnOffTwoFactorAuthentication(userId: number) {
    return this.usersRepository.update(userId, {
      isTwoFactorAuthenticationEnabled: false,
      twoFactorAuthenticationSecret: null
    })
  }

  async remove(id: number) {
    await this.usersRepository.delete(id);
  }
}
