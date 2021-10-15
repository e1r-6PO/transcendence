import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/service/auth.service';
import { AuthController } from 'src/controller/auth.controller';
import { User } from 'src/entity/user.entity';
import { PassportModule } from '@nestjs/passport'
import { GoogleStrategy } from 'src/google.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PassportModule ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy ]
})
export class AuthModule {}
