import { Module } from '@nestjs/common';
import { AppController } from 'src/controller/app.controller';
import { AppService } from 'src/service/app.service';
import { DbconnectModule } from './dbconnect.module'
import { UserModule } from './user.module'
import { GoogleStrategy } from 'src/google.strategy'
import { AuthModule } from './auth.module'

@Module({
  imports: [ DbconnectModule, UserModule, AuthModule ],
  controllers: [ AppController ],
  providers: [ AppService, GoogleStrategy ],
})
export class AppModule {}
