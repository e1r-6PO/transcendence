import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Match } from "src/entity/match.entity";
import { Repository } from "typeorm";

@Controller('api/games')
export class MatchsController {
    
    constructor(
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>
    ) {}

    @Get(':id')
    async getgamebyid(@Param('id') game_id: string) {
        var match: Match = await this.matchRepository.findOne({
            where: { id: game_id}
        })
        if (!match)
            return NotFoundException
        return match.toSafeFormat()
    }

    @Get('users/:id')
    async getallmatchfromuser(@Param('id') user_id) {
        var matches = await this.matchRepository.find({
            where: [{ player0: user_id }, {player1: user_id}]
        })
        var safe_matches = []
        matches.forEach(function(game) { safe_matches.push(game.toSafeFormat()) })
        return safe_matches
    }
}