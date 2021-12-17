import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessagesController } from "src/controller/messages.controller";
import { Channel } from "src/entity/channel.entity";
import { ChannelParticipant } from "src/entity/channelParticipant.entity";
import { Messages } from "src/entity/messages.entity";
import { Relationship } from "src/entity/relationship.entity";
import { User } from "src/entity/user.entity";
import { ChannelService } from "src/service/channel.service";
import { UsersService } from "src/service/users.service";
import { CustomJwtModule } from "./custom.jwt.module";

@Module({
  imports: [ TypeOrmModule.forFeature([Messages]), TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Channel, ChannelParticipant]), CustomJwtModule ],
  controllers: [ MessagesController ],
  providers: [ ChannelService ]
})
export class MessagesModule {}
