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

  googleLogin(req) {
    if (!req.user) {
      return { msg: 'No user from google' }
    }

    // this.usersRepository.find( { where: { email: req.user.email } } ).then(test => test)

    // console.log(test)

    // if (this.usersRepository.find( { where: { email: req.user.email } } ))
    //   return { msg: 'already registered: ' + req.user.firstName }

    var user : User;

    user = req.user

    user.logName = user.firstName

    this.usersRepository.save(user);

    return {
      msg: 'nouveau user: ' + user.firstName
    }
  }
}