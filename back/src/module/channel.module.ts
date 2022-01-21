import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelController } from "src/controller/channel.controller";
import { Achievements } from "src/entity/achievements.entity";
import { Channel } from "src/entity/channel.entity";
import { ChannelParticipant } from "src/entity/channelParticipant.entity";
import { Messages } from "src/entity/messages.entity";
import { Relationship } from "src/entity/relationship.entity";
import { User } from "src/entity/user.entity";
import { AchievementsService } from "src/service/achievements.service";
import { ChannelService } from "src/service/channel.service";
import { CustomJwtModule } from "./custom.jwt.module";

@Module({
  imports: [ TypeOrmModule.forFeature([User, Messages, Channel, ChannelParticipant, Relationship, Achievements]), CustomJwtModule ],
  controllers: [ ChannelController ],
  providers: [ ChannelService, AchievementsService]
})
export class ChannelModule {}
