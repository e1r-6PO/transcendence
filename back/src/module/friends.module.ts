import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendsController } from "src/controller/friends.controller";
import { Relationship } from "src/entity/relationship.entity";
import { User } from "src/entity/user.entity";
import { FriendsService } from "src/service/friends.service";
import { UsersService } from "src/service/users.service";
import { CustomJwtModule } from "./custom.jwt.module";

@Module({
    imports: [TypeOrmModule.forFeature([Relationship, User]), CustomJwtModule],
    controllers: [FriendsController],
    providers: [FriendsService, UsersService]
})
export class FriendsModule {}