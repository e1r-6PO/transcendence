import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessagesController } from "src/controller/messages.controller";
import { Messages } from "src/entity/messages.entity";
import { Relationship } from "src/entity/relationship.entity";
import { MessagesService } from "src/service/messages.service";
import { UsersService } from "src/service/users.service";
import { CustomJwtModule } from "./custom.jwt.module";

@Module({
  imports: [ TypeOrmModule.forFeature([Messages]), CustomJwtModule ],
  controllers: [ MessagesController ],
  providers: [ MessagesService ]
})
export class MessagesModule {}
