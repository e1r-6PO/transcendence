import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Match } from "src/entity/match.entity";
import { User } from "src/entity/user.entity";
import { TwoFaGuard, ValidTokenGuard } from "src/guards/account.guards";
import { Connection, getConnection, Repository } from "typeorm";

@Controller('/api/leaderboard')
@UseGuards(ValidTokenGuard, TwoFaGuard)
export class LeaderboardController {
    constructor(
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>,
        private connection: Connection
    ) {}
    @Get()
    async getlb() {
        return await this.connection
        .getRepository(User)
        .createQueryBuilder('ranking')
        .select('*')
        .addSelect('RANK () OVER (ORDER BY gameWin DESC) as "rank"')
        .execute()
    }

    // BEEEEEEEEEEEEEEURK
    @Get(':id')
    async getrank(@Param('id') id) {
        return (await this.getlb()).find((user: User) => user.id == id)
    }
}
