import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessagesController } from "src/controller/messages.controller";
import { Channel } from "src/entity/channel.entity";
import { Messages } from "src/entity/messages.entity";
import { Relationship } from "src/entity/relationship.entity";
import { User } from "src/entity/user.entity";
import { MessagesService } from "src/service/messages.service";
import { UsersService } from "src/service/users.service";
import { CustomJwtModule } from "./custom.jwt.module";

@Module({
  imports: [ TypeOrmModule.forFeature([Messages]), TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Channel]), CustomJwtModule ],
  controllers: [ MessagesController ],
  providers: [ MessagesService ]
})
export class MessagesModule {}
