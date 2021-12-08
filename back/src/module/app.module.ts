import { Module } from '@nestjs/common';
import { AppController } from 'src/controller/app.controller';
import { AppService } from 'src/service/app.service';
import { AuthModule } from './auth.module'
import { AllMiddleware } from './middleware.module';
import { DbConnectModule } from './db.connect.module';
import { ProfileModule } from './profile.module';
import { CustomJwtModule } from './custom.jwt.module';
import { MessagesModule } from './messages.module';
import { UsersModule } from './users.module';
import { ChatGateway } from 'src/webSocket/chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Messages } from 'src/entity/messages.entity';
import { Channel } from 'src/entity/channel.entity';
import { FriendsModule } from './friends.module';
import { GameGateway } from 'src/webSocket/game.gateway';

@Module({
  imports: [ DbConnectModule, UsersModule, ProfileModule, AuthModule, AllMiddleware, CustomJwtModule, MessagesModule,
    TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Messages]), TypeOrmModule.forFeature([Channel]), FriendsModule],
  controllers: [ AppController ],
  providers: [ AppService, ChatGateway, GameGateway ],
})
export class AppModule {}
