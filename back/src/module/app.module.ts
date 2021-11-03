import { Module } from '@nestjs/common';
import { AppController } from 'src/controller/app.controller';
import { AppService } from 'src/service/app.service';
import { UserModule } from './users.module'
import { AuthModule } from './auth.module'
import { AllMiddleware } from './middleware.module';
import { DbConnectModule } from './db.connect.module';
import { SocketModule } from './socket.module';
import { ProfileModule } from './profile.module';

@Module({
  imports: [ DbConnectModule, UserModule, ProfileModule, AuthModule, AllMiddleware, SocketModule ],
  controllers: [ AppController ],
  providers: [ AppService ],
})
export class AppModule {}
