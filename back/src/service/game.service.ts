import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BroadcastOperator, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Game } from "src/entity/game.entity";
import { Match } from "src/entity/match.entity";
import { User } from "src/entity/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository : Repository<User>,
        // @Inject(forwardRef(() => Game))
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>
      ) {}

    games = new Map<string, Game>()

    push_game(game: Game) {
        game.start()
        // this.games.push(game)
        this.games.set(game.id, game)
        // console.log(game.id, typeof game.id, 24, typeof 24, this.games.get(24), this.games.get(game.id))
    }

    join(client: Socket, id: string) { // join a running game or checking a past game
        var game: Game = this.games.get(id)

        if (game == undefined) { // game is finished
            // emit game is finished
            // close socket
        }
        else { // game is running
            if (client['info'].id == game.player0.id || client['info'].id == game.player1.id) { // the new client is one of the player
                client['game'] = game.id
                if (client['info'].id == game.player0.id) { // twice same condition = shit
                    game.player0socket = client
                }
                else {
                    game.player1socket = client 
                }
                client.emit('matchInfo', { id: game.id, player0: game.player0.toLightuser(), player1: game.player1.toLightuser() }) 
                client.join(game.id.toString())
            }
            else { // the new client is a spectator
                client.emit('matchInfo', { id: game.id, player0: game.player0.toLightuser(), player1: game.player1.toLightuser() }) 
                client.join(id.toString())
            }
        }
    }

    async save_game(game: Game) {
        var match: Match = new Match()

        match.id = game.id
        match.player0 = game.player0
        match.player1 = game.player1
        match.scorep0 = game.scorep0
        match.scorep1 = game.scorep1

        this.matchRepository.save(match)
    }

    endgame(game: Game) {
        game.stop()
        if (game.player0socket == null || game.scorep1 > game.scorep0) { // player0 dc or p1 won
            game.room.emit('matchEnd', { winner: game.player1.toLightuser(), looser: game.player0.toLightuser() })
            this.save_game(game)
        }
        else if (game.player1socket == null || game.scorep0 > game.scorep1) { //player1 dc or p0 won
            game.room.emit('matchEnd', { winner: game.player0.toLightuser(), looser: game.player1.toLightuser })
            this.save_game(game)
        }
        this.games.delete(game.id)
    }

    // maybe send the socket to watch for ?
    async game_watcher(game: Game) { // will pause the game and wait for a player reconnection need testing
        game.pause()

        if (game.player0socket == null) {
            var s1 = new Date().getTime() / 1000;
            while (game.player0socket == null) {
                if ((new Date().getTime() / 1000) - s1 > 5) // 5 seconds
                    break
                await new Promise(f => setTimeout(f, 50));
            }
            if (game.player0socket != null) { // the player reconnected himself
                game.unpause()
            }
            else { // gone from more than 5 seconds
                this.endgame(game)
                return
            }
        }
        else {
            var s1 = new Date().getTime() / 1000;
            while (game.player1socket == null) {
                if ((new Date().getTime() / 1000) - s1 > 5) // 5 seconds
                    break
                await new Promise(f => setTimeout(f, 50));
            }
            if (game.player1socket != null) { // the player reconnected himself
                game.unpause()
            }
            else { // gone from more than 5 seconds
                this.endgame(game)
                return
            }
        }
    }

    disconnect(client: Socket) {
        var game: Game = this.games.get(client['game'])

        if (game != undefined) {
            if (game.player0socket.id == client.id) {

                game.player0socket = null
                
                this.game_watcher(game)
            }
            else if (game.player1socket.id == client.id) {

                game.player1socket = null
                this.game_watcher(game)
            }
        }
    }
}