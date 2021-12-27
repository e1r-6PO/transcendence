import { Injectable } from "@nestjs/common";
import { BroadcastOperator, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Game } from "src/entity/game.entity";
import { User } from "src/entity/user.entity";

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
                client['game'] = game.id
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
            loser.emit('matchEnd', { message: 'You lost !'}) // update scores bad things to do
            // informe everyone
            this.games.delete(game.id)
        }
    }

    forfeit_disconnection(client: Socket, game: Game) {
        client.emit('matchEnd', { message: 'You win !'}) // update scores same bad thing
        // inform everyone
        this.games.delete(game.id)
    }

    async game_watcher(game: Game) {
        game.pause()

        if (game.player0socket == null) {
            var s1 = new Date().getTime() / 1000;
            while (game.player0socket == null) {
                if ((new Date().getTime() / 1000) - s1 > 2)
                    break
                await new Promise(f => setTimeout(f, 50));
            }
            if (game.player0socket != null) { // the player reconnected himself
                game.unpause()
            }
            else { // gone from more than 5 seconds
                this.forfeit_disconnection(game.player1socket, game)
                return
            }
        }
        else {
            var s1 = new Date().getTime() / 1000;
            while (game.player1socket == null) {
                if ((new Date().getTime() / 1000) - s1 > 2)
                    break
                await new Promise(f => setTimeout(f, 50));
            }
            if (game.player1socket != null) { // the player reconnected himself
                game.unpause()
            }
            else { // gone from more than 5 seconds
                this.forfeit_disconnection(game.player0socket, game)
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