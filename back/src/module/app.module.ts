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

@Module({
  imports: [ DbConnectModule, UsersModule, ProfileModule, AuthModule, AllMiddleware],
  controllers: [ AppController ],
  providers: [ AppService, AppGateway ],
})
export class AppModule {}
