import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { Game } from "src/entity/game.entity";

@Injectable()
export class GameService {
    games: Array<Game> = []
    newgameid: number = 0

    push_game(game: Game) {
        game.id = this.newgameid
        this.newgameid += 1
        game.start()
        this.games.push(game)
    }

    disconnect(client: Socket) {
        for (let i = 0; i < this.games.length; ++i) {
            if (this.games[i].players[0].id == client.id) {
                console.log(0)
                this.games[i].players[1].emit('matchEnd', { message: 'You win !'}) // update scores
                // this.games[i].players[1].disconnect()
                // notify spect
                this.games.splice(i, 1)
                return
            }
            else if (this.games[i].players[1].id == client.id) {
                console.log(1)
                this.games[i].players[0].emit('matchEnd', { message: 'You win !'}) // update scores
                // this.games[i].players[0].disconnect()
                // notify spect
                this.games.splice(i, 1)
                return
            }
            else {
                for (let j = 0; j < this.games[i].spectators.length; ++i) {
                    if (this.games[i].spectators[j].id === client.id) {
                        // remove him from spectator
                        return
                    }
                }
            }
        }
    }
}