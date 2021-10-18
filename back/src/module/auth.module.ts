import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/service/auth.service';
import { AuthController } from 'src/controller/auth.controller';
import { User } from 'src/entity/user.entity';
import { PassportModule } from '@nestjs/passport'
import { GoogleStrategy } from 'src/strategy/google.strategy';
import { JwtModule } from '@nestjs/jwt';
import { qdStrategy } from 'src/strategy/42.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // bon faut le store secure
      signOptions: { expiresIn: '1w' },
    }),
  ],
  controllers: [ AuthController ],
  providers: [ AuthService, GoogleStrategy, qdStrategy ]
})
export class AuthModule {}
