import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PrivateMessageController } from "src/controller/privateMessage.controller";
import { Channel } from "src/entity/channel.entity";
import { ChannelParticipant } from "src/entity/channelParticipant.entity";
import { Messages } from "src/entity/messages.entity";
import { PrivateMessage } from "src/entity/privateMessage.entity";
import { User } from "src/entity/user.entity";
import { ChannelService } from "src/service/channel.service";
import { PrivateMessageService } from "src/service/privateMessage.service";
import { CustomJwtModule } from "./custom.jwt.module";

@Module({
  imports: [TypeOrmModule.forFeature([PrivateMessage, User,]), CustomJwtModule, PrivateMessagesModule ],
  controllers: [ PrivateMessageController ],
  providers: [ PrivateMessageService ]
})
export class PrivateMessagesModule {}