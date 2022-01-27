import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BroadcastOperator, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Game } from "src/entity/game.entity";
import { Match } from "src/entity/match.entity";
import { PrivateMessage } from "src/entity/privateMessage.entity";
import { User } from "src/entity/user.entity";
import { ActiveGateway } from "src/webSocket/active.gateway";
import { Repository } from "typeorm";
import { AchievementsService } from "./achievements.service";
import { LeaderboardService } from "./leaderboard.service";

@Injectable()
export class GameService {
    constructor(
        private achievementService: AchievementsService,
        private leaderboardService: LeaderboardService,
        @InjectRepository(User)
        private readonly usersRepository : Repository<User>,
        // @Inject(forwardRef(() => Game))
        @InjectRepository(Match)
        private readonly matchRepository: Repository<Match>,
        @InjectRepository(PrivateMessage)
        private readonly privateMessageRepository: Repository<PrivateMessage>,

        private readonly activeGateway: ActiveGateway // used to send in game status
      ) {}

    games = new Map<string, Game>()

    startGame(game: Game) {
        game.player0.currentGame = game.id
        game.player1.currentGame = game.id
        this.usersRepository.update({id: game.player0.id}, {currentGame: game.id})
        this.usersRepository.update({id: game.player1.id}, {currentGame: game.id})
        this.activeGateway.server.emit('stateChanged', game.player0.toLightuser())
        this.activeGateway.server.emit('stateChanged', game.player1.toLightuser())
        game.start()
    }

    push_game(game: Game) {
        if (game.type == "ranked") // only start game if its ranked (not private)
            this.startGame(game)
        this.games.set(game.id, game)
    }

    join(client: Socket, id: string) { // join a running game or checking a past game
        var game: Game = this.games.get(id)

        if (game == undefined) { // game is finished
            client.emit('oldGame')// emit game is finished
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
                game.sendGameInfoTo(client)
                client.join(game.id.toString())
            }
            else { // the new client is a spectator
                game.sendGameInfoTo(client)
                client.join(id.toString())
            }
        }
    }

    async modifyElo(player0: User, player1: User, winner: User, match: Game) {
        const k = 30

        player0.elo = parseFloat((await this.usersRepository.findOne({where: {id: player0.id}})).elo as any)
        player1.elo = parseFloat((await this.usersRepository.findOne({where: {id: player1.id}})).elo as any)

        var p0 = (1.0 / (1.0 + Math.pow(10, ((player1.elo - player0.elo) / 400))));
        var p1 = (1.0 / (1.0 + Math.pow(10, ((player0.elo - player1.elo) / 400))));

        if (winner.id == player0.id) {
            var newelo0 = player0.elo + k * (1 - p0)
            var newelo1 = player1.elo + k * (0 - p1)
        }
        else if (winner.id == player1.id) {
            var newelo0: number = player0.elo + k * (0 - p0)
            var newelo1 = player1.elo + k * (1 - p1)
        }

        match.player0.elo = newelo0
        match.player1.elo = newelo1

        this.usersRepository.update({ id: player0.id }, {elo: newelo0})
        this.usersRepository.update({ id: player1.id }, {elo: newelo1})
    }

    async save_game(game: Game, winner: User) {
        var match: Match = new Match()

        match.id = game.id
        match.player0 = game.player0
        match.player1 = game.player1
        match.scorep0 = game.scorep0
        match.scorep1 = game.scorep1
        match.winner = winner
        match.mod = game.mod
        match.date = new Date()

        this.matchRepository.save(match)

        if (winner.id == game.player0.id) {
            this.usersRepository.increment({id: game.player0.id}, "gameWin", 1)
            this.usersRepository.increment({id: game.player1.id}, "gameLose", 1)
        }
        else {
            this.usersRepository.increment({id: game.player0.id}, "gameLose", 1)
            this.usersRepository.increment({id: game.player1.id}, "gameWin", 1)
        }

        await this.modifyElo(match.player0, match.player1, match.winner, game)
    }

    async endgame(game: Game) {
        if (game.status != "idle") {
            game.stop()
            if (game.player0socket == null || game.status == "forfeitp0" ||  game.scorep1 > game.scorep0) { // player0 dc or p1 won
                game.room.emit('matchEnd', { winner: game.player1.toLightuser(), looser: game.player0.toLightuser() })
                await this.save_game(game, game.player1)
                if (game.type == "private") {
                  this.privateMessageRepository.update({ sender: game.player0, target: game.player1, game_id: game.id }, {game_state: "finish", winner: game.player1})
                }
				this.achievementService.winGameAchievement(game.player1)
				this.leaderboardService.getrank(game.player1.id).then((rank) => {
					if (rank == 1)
						this.achievementService.firstRankAchievement(game.player1)
				})
			}
            else if (game.player1socket == null || game.status == "forfeitp1" || game.scorep0 > game.scorep1) { //player1 dc or p0 won
                game.room.emit('matchEnd', { winner: game.player0.toLightuser(), looser: game.player1.toLightuser })
                await this.save_game(game, game.player0)
                if (game.type == "private") {
                  this.privateMessageRepository.update({ sender: game.player0, target: game.player1, game_id: game.id }, {game_state: "finish", winner: game.player0})
                }
				this.achievementService.winGameAchievement(game.player0)
				this.leaderboardService.getrank(game.player0.id).then((rank) => {
					if (rank == 1)
						this.achievementService.firstRankAchievement(game.player0)
				})
            }
            if (game.player1socket != null)
                game.player1socket['game'] = undefined
            if (game.player0socket != null)
                game.player0socket['game'] = undefined
            this.achievementService.playGameAchievement(game.player0)
            this.achievementService.playGameAchievement(game.player1)

            //remove the game status from db and from front with socket
            game.player0.currentGame = ""
            game.player1.currentGame = ""
            this.usersRepository.update({id: game.player0.id}, {currentGame: ""})
            this.usersRepository.update({id: game.player1.id}, {currentGame: ""})
            this.activeGateway.server.emit('stateChanged', game.player0.toLightuser())
            this.activeGateway.server.emit('stateChanged', game.player1.toLightuser())
        }
        game.status = 'end'

        // update user info (not needed right now) in the socket
        this.usersRepository.findOne({where: {id: game.player0.id }}).then(updatedUser => game.player0socket['info'] = updatedUser)
        this.usersRepository.findOne({where: {id: game.player1.id }}).then(updatedUser => game.player1socket['info'] = updatedUser)

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
            if (game.player0socket != null && (game.status == "paused" || game.status == "setup")) { // the player reconnected himself
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
            if (game.player1socket != null && (game.status == "paused" || game.status == "setup")) { // the player reconnected himself
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
