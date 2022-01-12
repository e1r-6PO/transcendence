import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MatchsController } from "src/controller/matchs.controller";
import { Match } from "src/entity/match.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Match])],
    controllers: [MatchsController]
})
export class MatchsModule {}