import { Module } from '@nestjs/common';
import { AppController } from 'src/controller/app.controller';
import { AppService } from 'src/service/app.service';
import { DbconnectModule } from './dbconnect.module'
import { UserModule } from './user.module'

@Module({
  imports: [ DbconnectModule, UserModule ],
  controllers: [AppController, ],
  providers: [AppService],
})
export class AppModule {}
