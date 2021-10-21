import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/service/users.service';
import { UserController } from 'src/controller/users.controller';
import { User } from 'src/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1w' },
  }),
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
