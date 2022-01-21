import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AchievementsController } from "src/controller/achievements.controller";
import { Achievements } from "src/entity/achievements.entity";
import { AchievementsService } from "src/service/achievements.service";
import { CustomJwtModule } from "./custom.jwt.module";

@Module({
  imports: [ TypeOrmModule.forFeature([ Achievements ]), CustomJwtModule ],
  controllers: [ AchievementsController ],
  providers: [ AchievementsService ]
})
export class AchievementsModule {}