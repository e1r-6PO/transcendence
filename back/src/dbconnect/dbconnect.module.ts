import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../users/entity/user.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
        type: 'mariadb',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'my-secret-pw',
        database: 'transcendence',
        entities: [User],
        synchronize: true,
    }),
  ],
})
export class DbconnectModule {}
