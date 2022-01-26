import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Connection, Like, Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { existsSync } from 'fs';
import { LightUser } from 'src/entity/lightuser.entity';
import { Match } from 'src/entity/match.entity';
import { classToPlain, plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService : JwtService,
    private connection: Connection
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

    if (!user)
      throw new NotFoundException
    
    return user.toLightuser()
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

    return matches.sort((a, b) => (a > b ? 1 : -1))
  }

  async getUser(request: Request) {
    var user = await this.usersRepository.findOne(    //ptet moyen de mettre ca ailleur nan ?
      { where:
          { id: request.cookies['user_id'] }
      }
    );
    return user;
  }

  async getMatchHistory(id: number, offset: number, count: number) {
    var dbret = await this.connection
    .getRepository(Match)
    .createQueryBuilder('matchs')
    // DELETE
    .where('player0Id = :id', { id })
    .orWhere('player1Id = :id', { id })
    // POSTGRES
    // .where('matchs.player0 = :id', { id })
    // .orWhere('matchs.player1 = :id', { id })
    .leftJoinAndSelect('matchs.player0', 'player0')
    .leftJoinAndSelect('matchs.player1', 'player1')
    .leftJoinAndSelect('matchs.winner', 'winner')
    .orderBy('matchs.date', 'DESC')
    .take(count)
    .skip(offset)
    .getMany()

    var ret = new Array

    dbret.forEach(element => {
      var newel = plainToClass(Match, element).toSafeFormat()

      ret.push(newel)
    });
    return ret
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
