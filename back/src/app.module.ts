import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { DbconnectModule } from './dbconnect/dbconnect.module'
import { UsersModule } from './users/users.module';

@Module({
  imports: [ApiModule, DbconnectModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
