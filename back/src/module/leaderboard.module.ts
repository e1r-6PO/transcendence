import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LeaderboardController } from "src/controller/leaderboard.controller";
import { Match } from "src/entity/match.entity";
import { LeaderboardService } from "src/service/leaderboard.service";
import { CustomJwtModule } from "./custom.jwt.module";

@Module({
  imports: [ TypeOrmModule.forFeature([Match]), CustomJwtModule],
  controllers: [ LeaderboardController ],
  providers: [ LeaderboardService ]
})
export class LeaderboardModule {}