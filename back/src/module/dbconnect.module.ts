import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../entity/user.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
        type: 'mariadb',
        host: 'transcendence-database',
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
/*essayez de rm ca ^^*/