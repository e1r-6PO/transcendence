import { Module } from '@nestjs/common';
import { AppController } from 'src/controller/app.controller';
import { AppService } from 'src/service/app.service';
import { AuthModule } from './auth.module'
import { AllMiddleware } from './middleware.module';
import { DbConnectModule } from './db.connect.module';
import { ProfileModule } from './profile.module';
import { CustomJwtModule } from './custom.jwt.module';
import { UsersModule } from './users.module';
import { AppGateway } from 'src/webSocket/app.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Messages } from 'src/entity/messages.entity';
import { ChatModule } from './chat.module';

@Module({
  imports: [ DbConnectModule, UsersModule, ProfileModule, AuthModule, AllMiddleware, CustomJwtModule, ChatModule, TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Messages])],
  controllers: [ AppController ],
  providers: [ AppService, AppGateway ],
})
export class AppModule {}
