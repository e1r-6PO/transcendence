import { InjectRepository } from "@nestjs/typeorm"
import { BroadcastOperator, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Repository } from "typeorm"
import { Ball } from "./ball.entity"
import { User } from "./user.entity"

@Entity()
export class Game {

    @PrimaryGeneratedColumn()
    id: number

    loopId: any
    players: Array<Socket>
    spectators: Array<Socket>
    balls: Array<Ball>
    room: BroadcastOperator<DefaultEventsMap>

    @ManyToOne(() => User, {
        eager: true,
    })
    player0: User
    @ManyToOne(() => User, {
        eager: true,
    })
    player1: User

    @Column( {default: 0} )
    scorep0: number
    @Column( {default: 0} )
    scorep1: number

    tick() {
        for (let i = 0; i < this.balls.length; ++i) {
            this.balls[i].tick();
        }
        let ballsinfo = []
        for (let i = 0; i < this.balls.length; ++i) {
            ballsinfo.push({ id: i, ball_location: [this.balls[i].x, this.balls[i].y] })
        }
        this.room.emit('gameInfo', ballsinfo)
        // emit to spec etc...
    }

    async start() {
        this.player0 = this.players[0]['info'] // putting the infos inside a User class to get access to function
        this.player1 = this.players[1]['info'] //
        this.room.emit('matchFound', { id: this.id})
        // this.players[1].emit('matchFound', { id: this.id})
        await new Promise(f => setTimeout(f, 250)); // awaiting client switching page client side
        this.room.emit('matchInfo', { id: this.id, player0: this.player0.toLightuser(), player1: this.player1.toLightuser() }) 
        for (let i: number = 3; i >= 0; --i) {
            this.room.emit('matchSetup', { gameStart: i} ) 
            await new Promise(f => setTimeout(f, 1000)); // countdown
        }
        this.balls = new Array
        this.balls.push(new Ball)
        this.loopId = setInterval(this.tick.bind(this), 1000 / 50)
    }

    stop() {
        clearInterval(this.loopId)
        this.loopId = null
    }
}