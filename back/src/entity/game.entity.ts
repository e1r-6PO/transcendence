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
    player0socket: Socket | null = null
    player1socket: Socket | null = null
    // spectators: Array<Socket>
    balls: Array<Ball>
    room: BroadcastOperator<DefaultEventsMap>
    is_game_paused: boolean = false

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

    async create_new_ball(time: number) {
        await new Promise(f => setTimeout(f, time));
        this.balls.push(new Ball)
    }

    tick() {
        let ballsinfo = []
        for (let i = 0; i < this.balls.length; ++i) {
            var score = this.balls[i].tick();
            if (score == 0) {
                this.scorep1++
                ballsinfo.push({ id: i, status: "erased", ball_location: [this.balls[i].x, this.balls[i].y] })
                this.balls.slice(i, 1)
                this.create_new_ball(1000)
            }
            else if (score == 1) {
                this.scorep0++
                ballsinfo.push({ id: i, status: "erased", ball_location: [this.balls[i].x, this.balls[i].y] })
                this.balls.slice(i, 1)
                this.create_new_ball(1000)
            }
            else {
                ballsinfo.push({ id: i, status: "normal", ball_location: [this.balls[i].x, this.balls[i].y] })
            }
        }
        this.room.emit('gameInfo', ballsinfo)
        console.log(this.scorep0, this.scorep1)
    }

    matchinfo() {
        this.room.emit('matchInfo', { id: this.id, player0: this.player0.toLightuser(), player1: this.player1.toLightuser() }) 
    }

    async start() {
        this.room.emit('matchFound', { id: this.id})
        // this.players[1].emit('matchFound', { id: this.id})
        await new Promise(f => setTimeout(f, 250)); // awaiting client switching page client side
        this.matchinfo()
        for (let i: number = 3; i >= 0; --i) {
            this.room.emit('matchSetup', { gameStart: i} ) 
            await new Promise(f => setTimeout(f, 1000)); // countdown
        }
        this.balls = new Array
        this.balls.push(new Ball)
        this.loopId = setInterval(this.tick.bind(this), 1000 / 20)
    }

    pause() { // client is the client that disconnected
        clearInterval(this.loopId)
    }

    unpause() {
        this.loopId = setInterval(this.tick.bind(this), 1000 / 20)
    }

    stop() {
        clearInterval(this.loopId)
        this.loopId = null
    }
}