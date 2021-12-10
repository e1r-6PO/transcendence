import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelController } from "src/controller/channel.controller";
import { MessagesController } from "src/controller/messages.controller";
import { Channel } from "src/entity/channel.entity";
import { ChannelParticipant } from "src/entity/channelParticipant.entity";
import { Messages } from "src/entity/messages.entity";
import { User } from "src/entity/user.entity";
import { MessagesService } from "src/service/messages.service";
import { CustomJwtModule } from "./custom.jwt.module";

@Module({
  imports: [ TypeOrmModule.forFeature([User, Messages, Channel, ChannelParticipant]), CustomJwtModule ],
  controllers: [ ChannelController ],
  providers: []
})
export class ChannelModule {}
