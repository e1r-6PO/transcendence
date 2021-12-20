import { Socket } from "socket.io"

export class Game {

    id: number
    loopId: any
    players: Array<Socket>
    spectators: Array<Socket>
    // balls: Array<Ball>

    tick() {
        // console.log('wsh')
        // do logic
    }

    start() {
        this.players[0].emit('matchFound', { id: this.id})
        this.players[1].emit('matchFound', { id: this.id})
        this.loopId = setInterval(this.tick, 1000 / 20)
    }

    stop() {
        clearInterval(this.loopId)
        this.loopId = null
    }
}