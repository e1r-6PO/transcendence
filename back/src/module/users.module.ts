import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "src/controller/users.controller";
import { User } from "src/entity/user.entity";
import { UsersService } from "src/service/users.service";
import { CustomJwtModule } from "./custom.jwt.module";

@Module({
  imports: [ TypeOrmModule.forFeature([User]), CustomJwtModule ],
  controllers: [ UsersController ],
  providers: [ UsersService ]
})
export class UsersModule {}
