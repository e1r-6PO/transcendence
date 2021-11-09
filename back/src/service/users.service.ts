import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Like, Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService : JwtService
  ) {}

  async findOne(nick: string) {
    // await new Promise(r => setTimeout(r, 2000));
    var user = await this.usersRepository.findOne(
      { where:
        { nickName: nick }
      }
    );
    if (!user)
      throw new NotFoundException
    var filtered = {
      id: user.id,
      nickName: user.nickName,
      picture: user.picture
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

  async remove(id: number) {
    await this.usersRepository.delete(id);
  }
}
