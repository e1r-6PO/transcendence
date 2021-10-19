import { Module } from '@nestjs/common';
import { AppController } from 'src/controller/app.controller';
import { AppService } from 'src/service/app.service';
import { DbconnectModule } from './dbconnect.module'
import { UserModule } from './users.module'
import { AuthModule } from './auth.module'
import { LogModule } from './log.module';

@Module({
  imports: [ DbconnectModule, UserModule, AuthModule, LogModule ],
  controllers: [ AppController ],
  providers: [ AppService ],
})
export class AppModule {}
