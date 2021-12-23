import { Socket } from "socket.io"
import { User } from "./user.entity"

export class Game {

    id: number
    loopId: any
    players: Array<Socket>
    spectators: Array<Socket>
    // balls: Array<Ball>
    player0: User
    player1: User
    tick() {
        // console.log('wsh')
        // do logic
    }

    async start() {
        this.player0 = this.players[0]['info']
        this.player1 = this.players[1]['info']
        this.players[0].emit('matchFound', { id: this.id})
        this.players[1].emit('matchFound', { id: this.id})
        await new Promise(f => setTimeout(f, 250));
        this.players[0].emit('matchInfo', { id: this.id, player0: this.player0.toLightuser(), player1: this.player1.toLightuser() })
        this.players[1].emit('matchInfo', { id: this.id, player0: this.player0.toLightuser(), player1: this.player1.toLightuser() })
        this.loopId = setInterval(this.tick, 1000 / 20)
    }

    stop() {
        clearInterval(this.loopId)
        this.loopId = null
    }
}