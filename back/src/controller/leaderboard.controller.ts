import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { classToPlain, plainToClass } from "class-transformer";
import { Match } from "src/entity/match.entity";
import { User } from "src/entity/user.entity";
import { TwoFaGuard, ValidTokenGuard } from "src/guards/account.guards";
import { LeaderboardService } from "src/service/leaderboard.service";
import { Connection, getConnection, Repository } from "typeorm";

@Controller('/api/leaderboard')
@UseGuards(ValidTokenGuard, TwoFaGuard)
export class LeaderboardController {
    constructor(
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>,
        private connection: Connection,
        private readonly leaderboardService: LeaderboardService
    ) {}
    @Get()
    async getlb() {
        return this.leaderboardService.getlb()
    }

    @Get(':id')
    async getrank(@Param('id') id) {
        return this.leaderboardService.getrank(id)
    }
}
