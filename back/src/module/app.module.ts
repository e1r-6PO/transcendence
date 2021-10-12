import { Module } from '@nestjs/common';
import { AppController } from '../controller/app.controller';
import { AppService } from '../service/app.service';
import { DbconnectModule } from './dbconnect.module'

@Module({
  imports: [ DbconnectModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
