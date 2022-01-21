import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from "src/controller/users.controller";
import { Achievements } from "src/entity/achievements.entity";
import { Relationship } from "src/entity/relationship.entity";
import { User } from "src/entity/user.entity";
import { AchievementsService } from "src/service/achievements.service";
import { FriendsService } from "src/service/friends.service";
import { UsersService } from "src/service/users.service";
import { CustomJwtModule } from "./custom.jwt.module";

@Module({
  imports: [ TypeOrmModule.forFeature([User, Relationship, Achievements]), CustomJwtModule ],
  controllers: [ UsersController ],
  providers: [ UsersService, FriendsService, AchievementsService ]
})
export class UsersModule {}
