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
import { CustomJwtModule } from './custom.jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PassportModule, CustomJwtModule ],
  controllers: [ AuthController ],
  providers: [ AuthService, googleStrategy, qdStrategy, githubStrategy ]
})
export class AuthModule {}
