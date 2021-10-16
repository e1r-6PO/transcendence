import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm'
import * as cookieParser from 'cookie';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService : JwtService
  ) {}

  async me(request) {
    var user = await this.usersRepository.findOne(
      { where:
          { id: this.jwtService.decode(cookieParser.parse(request.headers.cookie)['jwt'])['id'] }
      }
    );
    return user;
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOne(id);
  }

  // update(id: number, updateUserDto: User) {
  //   return `This action updates a #${id} user`;
  // }

  async remove(id: number) {
    await this.usersRepository.delete(id);
  }
}
