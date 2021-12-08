import { Module } from '@nestjs/common';
import { AppController } from 'src/controller/app.controller';
import { AppService } from 'src/service/app.service';
import { AuthModule } from './auth.module'
import { AllMiddleware } from './middleware.module';
import { DbConnectModule } from './db.connect.module';
import { ProfileModule } from './profile.module';
import { CustomJwtModule } from './custom.jwt.module';
import { UsersModule } from './users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Messages } from 'src/entity/messages.entity';
import { FriendsModule } from './friends.module';

//Gateway
import { ChatGateway } from 'src/webSocket/chat.gateway';
import { GameGateway } from 'src/webSocket/game.gateway';
import { ChatModule } from './chat.module';

@Module({
  imports: [ DbConnectModule, UsersModule, ProfileModule, AuthModule, AllMiddleware, CustomJwtModule, ChatModule,
    TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Messages]), FriendsModule],
  controllers: [ AppController ],
  providers: [ AppService, ChatGateway, GameGateway ],
})
export class AppModule {}
