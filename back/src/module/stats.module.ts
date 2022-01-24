import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StatsController } from "src/controller/stats.controller";
import { User } from "src/entity/user.entity";
import { UsersService } from "src/service/users.service";
import { ActiveGateway } from "src/webSocket/active.gateway";
import { CustomJwtModule } from "./custom.jwt.module";

@Module({
    imports: [ CustomJwtModule, TypeOrmModule.forFeature([User]) ],
    controllers: [ StatsController ],
    providers: [ UsersService, ActiveGateway ]
})
export class StatsModule {}