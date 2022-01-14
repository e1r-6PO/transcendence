import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { classToPlain, plainToClass } from "class-transformer";
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
        var dbret = await this.connection
        .getRepository(User)
        .createQueryBuilder('ranking')
        .select('*')
        .addSelect('RANK () OVER (ORDER BY gameWin DESC) as "rank"')
        .limit(50)
        .execute()

        var ret = new Array

        dbret.forEach(element => {
            var newel = classToPlain((plainToClass(User, element).toLightuser()))
            newel.rank = element.rank
            ret.push(newel)
        });

        // realuser.forEach((element: User) => { element.toLightuser() })
        return ret
    }

    // BEEEEEEEEEEEEEEURK
    @Get(':id')
    async getrank(@Param('id') id) {
        return parseInt((await this.connection
        .getRepository(User)
        .createQueryBuilder('ranking')
        .select('*')
        .from(subQuery => {
            return subQuery
              .select('*')
              .addSelect('RANK () OVER (ORDER BY gameWin DESC)', 'rank')
              .from(User, 'user')
          }, 'user')
        .where('user.id = :id', { id })
        .getRawOne()).rank)
    }
}
