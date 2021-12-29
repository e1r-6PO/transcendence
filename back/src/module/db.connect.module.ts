import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Messages } from 'src/entity/messages.entity';
import { Relationship } from 'src/entity/relationship.entity';
import { User } from 'src/entity/user.entity';
import { Channel } from 'src/entity/channel.entity';
import { ChannelParticipant } from 'src/entity/channelParticipant.entity';
import { PrivateMessage } from 'src/entity/privateMessage.entity';
import { Match } from 'src/entity/match.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.DBUSER,
      password: process.env.DBPSWD,
      database: 'transcendence',
      entities: [User, Relationship, Messages, Channel, ChannelParticipant, PrivateMessage, Match],
      synchronize: true,
    }),
  ],
})
export class DbConnectModule {}