import { Injectable } from "@nestjs/common";
import { BroadcastOperator, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Game } from "src/entity/game.entity";

export class GameService {
    games = new Map<number, Game>()

    push_game(game: Game, room: BroadcastOperator<DefaultEventsMap>) {
        game.room = room
        game.start()
        // this.games.push(game)
        this.games.set(game.id, game)
        // console.log(game.id, typeof game.id, 24, typeof 24, this.games.get(24), this.games.get(game.id))
    }

    join(client: Socket, id: number) { // check if match is done
        var game: Game = this.games.get(id)

        if (game == undefined) { // game is finished

        }
        else {
            if (client['info'].id == game.player0.id || client['info'].id == game.player1.id) {
                if (client['info'].id == game.player0.id) { // twice same condition = shit
                    game.player0socket = client
                }
                else {
                    game.player1socket = client 
                }
                client.emit('matchInfo', { id: game.id, player0: game.player0.toLightuser(), player1: game.player1.toLightuser() }) 
                client.join(game.id.toString()) // rejoin the game
            }
            else {
                client.emit('matchInfo', { id: game.id, player0: game.player0.toLightuser(), player1: game.player1.toLightuser() }) 
                client.join(id.toString()) // join as spectator
            }
        }
    }

    forfeit(client: Socket, id: number) {
        var game: Game = this.games.get(id) 

        if (game != undefined) {
            var winner: Socket = (client.id == game.player0socket.id ? game.player1socket : game.player0socket)
            var loser: Socket = (client.id == game.player0socket.id ? game.player0socket : game.player1socket)

            winner.emit('matchEnd', { message: 'You win !'}) // update scores
            loser.emit('matchEnd', { message: 'You lost !'}) // update scores
        }
    }

    disconnect(client: Socket) {
        this.games.forEach(function(game, id, map) {
            if (game.player0socket.id == client.id) {
                // game.players[1].emit('matchEnd', { message: 'You win !'}) // update scores
                // game.players[1].disconnect()
                // notify spect
                game.player0socket = null
                game.pause()
                // game.stop()
                // map.delete(id)
                // return
            }
            else if (game.player1socket.id == client.id) {
                // game.players[0].emit('matchEnd', { message: 'You win !'}) // update scores
                // game.players[0].disconnect()
                // notify spect
                game.player1socket = null
                game.pause()
                // game.stop()
                // map.delete(id)
                // return
            }
            // else {
            //     for (let j = 0; j < game.spectators.length; ++j) {
            //         if (game.spectators[j].id === client.id) {
            //             // remove him from spectator
            //             // return
            //         }
            //     }
            // }
        })
    }
}