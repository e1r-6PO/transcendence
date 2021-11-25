import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from 'src/controller/profile.controller';
import { ProfileService } from 'src/service/profile.service';
import { User } from 'src/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { CustomJwtModule } from './custom.jwt.module';
import { UsersService } from 'src/service/users.service';
import { Relationship } from 'src/entity/relationship.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Relationship]), CustomJwtModule ],
  controllers: [ ProfileController ],
  providers: [ ProfileService, UsersService ]
})
export class ProfileModule {}
