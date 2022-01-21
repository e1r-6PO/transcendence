import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from 'src/controller/profile.controller';
import { ProfileService } from 'src/service/profile.service';
import { User } from 'src/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { CustomJwtModule } from './custom.jwt.module';
import { UsersService } from 'src/service/users.service';
import { Relationship } from 'src/entity/relationship.entity';
import { ChannelService } from 'src/service/channel.service';
import { ChannelParticipant } from 'src/entity/channelParticipant.entity';
import { Messages } from 'src/entity/messages.entity';
import { Channel } from 'src/entity/channel.entity';
import { AchievementsService } from 'src/service/achievements.service';
import { Achievements } from 'src/entity/achievements.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Relationship, ChannelParticipant, Channel, Messages, Achievements]), CustomJwtModule ],
  controllers: [ ProfileController ],
  providers: [ ProfileService, UsersService, ChannelService, AchievementsService ]
})
export class ProfileModule {}
