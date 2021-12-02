import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatController } from "src/controller/chat.controller";
import { Messages } from "src/entity/messages.entity";
import { Relationship } from "src/entity/relationship.entity";
import { MessagesService } from "src/service/chat.service";
import { UsersService } from "src/service/users.service";
import { CustomJwtModule } from "./custom.jwt.module";

@Module({
  imports: [ TypeOrmModule.forFeature([Messages]), CustomJwtModule ],
  controllers: [ ChatController ],
  providers: [ MessagesService ]
})
export class ChatModule {}
