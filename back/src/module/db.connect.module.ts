import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Messages } from 'src/entity/messages.entity';
import { Relationship } from 'src/entity/relationship.entity';
import { User } from 'src/entity/user.entity';
import { Channel } from 'src/entity/channel.entity';
import { ChannelParticipant } from 'src/entity/channelParticipant.entity';
import { PrivateMessage } from 'src/entity/privateMessage.entity';
import { Match } from 'src/entity/match.entity';
import { Achievements } from 'src/entity/achievements.entity';

@Module({
  imports: [
    // POSTGRES
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DBHOST,
      port: 5432,
      username: process.env.DBUSER,
      password: process.env.DBPSWD,
      database: 'transcendence',
      entities: [User, Relationship, Messages, Channel, ChannelParticipant, PrivateMessage, Match, Achievements ],
      synchronize: true,
    }),
  ],
})
export class DbConnectModule {}
