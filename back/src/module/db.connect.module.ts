import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.DBUSER,
      password: process.env.DBPSWD,
      database: 'transcendence',
      entities: [User],
      synchronize: true,
    }),
  ],
})
export class DbConnectModule {}