import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm'
import { Response } from 'express'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService : JwtService
  ) {}

  // login function
  async login(req, response) {
    if (!req.user) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    }

    // if the user exists already create it
    var user = await this.usersRepository.findOne(
      { where:
          { provider: req.user.provider, provider_id: req.user.provider_id  }
      }
    );
    if (!user)
    {
      var fill_user : User;
      fill_user = req.user
      fill_user.nickName = "" // REMOVE AFTER USER MUST CHOOSE HIS NICKNAME
      fill_user.gameWin = 0;
      fill_user.gameLose = 0;
      user = await this.usersRepository.save(fill_user);
    }

    //create the token
    const jwt = await this.jwtService.signAsync({
      id: user.id
    })

    response.cookie('jwt', jwt, { httpOnly: true })

    return { message: "success" };
  }

  // logout function
  async logout(req, response) {
    response.clearCookie('jwt')
  }

  async is_logged(req, res) {
    try {
      await this.jwtService.verifyAsync(req.cookies['jwt'])
    } catch (e) 
    {
      this.logout(req, res)
      return { status: false, nickname: "" }
    }
    var user = await this.usersRepository.findOne(
      { where:
          { id: this.jwtService.decode(req.cookies['jwt'])['id'] }
      }
    )
    if (!user)
    {
      this.logout(req, res)
      return { status: false, nickname: "" }
    }
    return { status: true, nickname: user.nickName }
  }
}