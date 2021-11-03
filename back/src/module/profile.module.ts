import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ProfileController } from 'src/controller/profile.controller';
import { ProfileService } from 'src/service/profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1w' },
  }),
  ],
  controllers: [ ProfileController ],
  providers: [ ProfileService ]
})
export class ProfileModule {}
