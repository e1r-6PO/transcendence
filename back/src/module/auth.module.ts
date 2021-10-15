import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/service/auth.service';
import { AuthController } from 'src/controller/auth.controller';
import { User } from 'src/entity/user.entity';
import { PassportModule } from '@nestjs/passport'
import { GoogleStrategy } from 'src/google.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PassportModule,
    JwtModule.register({
      secret: 'ouais ouais ouais c le secret', // bon faut le store secure
      signOptions: { expiresIn: '1w' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy ]
})
export class AuthModule {}
