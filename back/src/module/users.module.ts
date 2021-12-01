import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "src/controller/users.controller";
import { Relationship } from "src/entity/relationship.entity";
import { User } from "src/entity/user.entity";
import { FriendsService } from "src/service/friends.service";
import { UsersService } from "src/service/users.service";
import { CustomJwtModule } from "./custom.jwt.module";

@Module({
  imports: [ TypeOrmModule.forFeature([User, Relationship]), CustomJwtModule ],
  controllers: [ UsersController ],
  providers: [ UsersService, FriendsService ]
})
export class UsersModule {}
