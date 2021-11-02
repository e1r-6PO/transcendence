import { Module } from '@nestjs/common';
import { AppController } from 'src/controller/app.controller';
import { AppService } from 'src/service/app.service';
import { UserModule } from './users.module'
import { AuthModule } from './auth.module'
import { HasNickModule, ValidTokenModule } from './middleware.module';
import { DbConnectModule } from './db.connect.module';

@Module({
  imports: [ DbConnectModule, UserModule, AuthModule, ValidTokenModule, HasNickModule ],
  controllers: [ AppController ],
  providers: [ AppService ],
})
export class AppModule {}
