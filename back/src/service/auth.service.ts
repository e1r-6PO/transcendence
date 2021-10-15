import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async googleLogin(req) {
    if (!req.user) {
      return { msg: 'No user from google' }
    }

    const user = await this.usersRepository.findOne(
      { where:
          { email: req.user.email }
      }
  );
    if (user)
      return {
        msg: 'User already register ' + user.firstName
      }
    var fill_user : User;
    fill_user = req.user

    fill_user.nickName = fill_user.firstName

    await this.usersRepository.save(fill_user);

    return {
      msg: 'nouveau user: ' + fill_user.firstName
    }
  }
}