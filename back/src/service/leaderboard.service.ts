import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { classToPlain, plainToClass } from "class-transformer";
import { Match } from "src/entity/match.entity";
import { User } from "src/entity/user.entity";
import { Connection, Repository } from "typeorm";

@Injectable()
export class LeaderboardService {
    constructor(
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>,
        private connection: Connection
    ) {}

    async getlb() {
        var dbret = await this.connection
        .getRepository(User)
        .createQueryBuilder('ranking')
        .select('*')
        .addSelect('RANK () OVER (ORDER BY elo DESC) as "rank"')
        .limit(50)
        .execute()

        var ret = new Array

        dbret.forEach(element => {
            var newel = classToPlain((plainToClass(User, element).toLightuser()))
            newel.rank = element.rank
            ret.push(newel)
        });

        return ret
    }

    async getrank(id: number) {
        return parseInt((await this.connection
        .getRepository(User)
        .createQueryBuilder('ranking')
        .select('*')
        .from(subQuery => {
            return subQuery
              .select('*')
              .addSelect('RANK () OVER (ORDER BY elo DESC)', 'rank')
              .from(User, 'user')
          }, 'data')
        .where('data.id = :id', { id })
        .getRawOne()).rank)
    }
}