import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BroadcastOperator, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Game } from "src/entity/game.entity";
import { Match } from "src/entity/match.entity";
import { PrivateMessage } from "src/entity/privateMessage.entity";
import { User } from "src/entity/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository : Repository<User>,
        // @Inject(forwardRef(() => Game))
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>,
        @InjectRepository(PrivateMessage)
        private readonly privateMessageRepository: Repository<PrivateMessage>,
      ) {}

    games = new Map<string, Game>()

    push_game(game: Game) {
        if (game.type == "ranked") // only start game if its ranked (not private)
            game.start()
        // this.games.push(game)
        this.games.set(game.id, game)
        // console.log(game.id, typeof game.id, 24, typeof 24, this.games.get(24), this.games.get(game.id))
    }

    join(client: Socket, id: string) { // join a running game or checking a past game
        var game: Game = this.games.get(id)

        if (game == undefined) { // game is finished
            // emit game is finished
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
                // if (game.hasStarted == false && game.player0socket != null && game.player1socket != null) // check if private ?
                //     game.start()
                client.emit('matchInfo', { id: game.id, player0: game.player0.toLightuser(), player1: game.player1.toLightuser() }) 
                client.join(game.id.toString())
            }
            else { // the new client is a spectator
                client.emit('matchInfo', { id: game.id, player0: game.player0.toLightuser(), player1: game.player1.toLightuser() }) 
                client.join(id.toString())
            }
        }
    }

    async save_game(game: Game, winner: User) {
        var match: Match = new Match()

        match.id = game.id
        match.player0 = game.player0
        match.player1 = game.player1
        match.scorep0 = game.scorep0
        match.scorep1 = game.scorep1
        match.winner = winner

        this.matchRepository.save(match)
    }

    endgame(game: Game) {
        if (game.status != "idle") {
            game.stop()
            if (game.player0socket == null || game.scorep1 > game.scorep0 || game.status == "forfeitp0") { // player0 dc or p1 won
                game.room.emit('matchEnd', { winner: game.player1.toLightuser(), looser: game.player0.toLightuser() })
                this.save_game(game, game.player1)
                if (game.type == "private") {
                  this.privateMessageRepository.update({ sender: game.player0, target: game.player1, game_id: game.id }, {game_state: "finish", winner: game.player1})
                }
            }
            else if (game.player1socket == null || game.scorep0 > game.scorep1 || game.status == "forfeitp1") { //player1 dc or p0 won
                game.room.emit('matchEnd', { winner: game.player0.toLightuser(), looser: game.player1.toLightuser })
                this.save_game(game, game.player0)
                if (game.type == "private") {
                  this.privateMessageRepository.update({ sender: game.player0, target: game.player1, game_id: game.id }, {game_state: "finish", winner: game.player0})
                }
            }
            if (game.player1socket != null)
                game.player1socket['game'] = undefined
            if (game.player0socket != null)
                game.player0socket['game'] = undefined
        }
        this.games.delete(game.id)
    }

    // maybe send the socket to watch for ?
    async game_watcher(game: Game, client: Socket) { // will pause the game and wait for a player reconnection need testing
        game.pause()

        var timeout = 10 // 10 seconds

        if (game.player0socket == client) {
            game.player0socket = null
            var s1 = new Date().getTime() / 1000;
            while (game.player0socket == null) {
                if ((new Date().getTime() / 1000) - s1 > timeout)
                    break
                await new Promise(f => setTimeout(f, 50));
            }
            if (game.player0socket != null && game.status == "paused") { // the player reconnected himself
                if (game.player1socket != null) // unpause only if player1 is connected
                    game.unpause()
            }
            else { // gone from more than 5 seconds
                this.endgame(game)
                return
            }
        }
        else {
            game.player1socket = null
            var s1 = new Date().getTime() / 1000;
            while (game.player1socket == null) {
                if ((new Date().getTime() / 1000) - s1 > timeout) // 5 seconds
                    break
                await new Promise(f => setTimeout(f, 50));
            }
            if (game.player1socket != null && game.status == "paused") { // the player reconnected himself
                if (game.player0socket != null) // unpause only if player1 is connected
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
            if (game.player0socket.id == client.id || game.player1socket.id == client.id) {
                if (game.status != "idle")
                    this.game_watcher(game, client)
                else
                    this.endgame(game)
            }
        }
    }
}