import { Injectable } from '@nestjs/common';
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

  // google login
  async googleLogin(req, response) {
    if (!req.user) {
      return { msg: 'No user from google' }
    }

    // if the user exists already create it
    var user = await this.usersRepository.findOne(
      { where:
          { email: req.user.email }
      }
    );
    if (!user)
    {
      var fill_user : User;
      fill_user = req.user
      fill_user.nickName = fill_user.firstName
      user = await this.usersRepository.save(fill_user);
    }

    //create the token
    const jwt = await this.jwtService.signAsync({
      id: user.id
    })

    response.cookie('jwt', jwt, { httpOnly: true })

    return { message: "success" };
  }

  // 42 login function
  async qdLogin(req, response) {
    if (!req.user) {
      return { msg: 'No user from 42' }
    }

    // if the user exists already create it
    var user = await this.usersRepository.findOne(
      { where:
          { email: req.user.email }
      }
    );
    if (!user)
    {
      var fill_user : User;
      fill_user = req.user
      fill_user.nickName = fill_user.firstName
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
}