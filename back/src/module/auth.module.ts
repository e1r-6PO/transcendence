import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/service/auth.service';
import { AuthController } from 'src/controller/auth.controller';
import { User } from 'src/entity/user.entity';
import { PassportModule } from '@nestjs/passport'
import { googleStrategy } from 'src/strategy/google.strategy';
import { JwtModule } from '@nestjs/jwt';
import { qdStrategy } from 'src/strategy/42.strategy';
import { githubStrategy } from 'src/strategy/github.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1w' },
    }),
  ],
  controllers: [ AuthController ],
  providers: [ AuthService, googleStrategy, qdStrategy, githubStrategy ]
})
export class AuthModule {}
