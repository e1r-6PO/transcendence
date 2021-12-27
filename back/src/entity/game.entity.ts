import { Socket } from "socket.io"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
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

    @ManyToOne(() => User, {
        eager: true,
    })
    player0: User
    @ManyToOne(() => User, {
        eager: true,
    })
    player1: User

    @Column()
    scorep0: number
    @Column()
    scorep1: number

    tick() {
        for (let i = 0; i < this.balls.length; ++i) {
            this.balls[i].tick();
        }
        let ballsinfo = []
        for (let i = 0; i < this.balls.length; ++i) {
            ballsinfo.push({ id: i, ball_location: [this.balls[i].x, this.balls[i].y] })
        }
        this.players[0].emit('gameInfo', ballsinfo)
        this.players[1].emit('gameInfo', ballsinfo)
        // emit to spec etc...
    }

    async start() {
        this.player0 = this.players[0]['info'] // putting the infos inside a User class to get access to function
        this.player1 = this.players[1]['info'] //
        this.players[0].emit('matchFound', { id: this.id})
        this.players[1].emit('matchFound', { id: this.id})
        await new Promise(f => setTimeout(f, 250)); // awaiting client switching page client side
        this.players[0].emit('matchInfo', { id: this.id, player0: this.player0.toLightuser(), player1: this.player1.toLightuser(), side: "left" }) 
        this.players[1].emit('matchInfo', { id: this.id, player0: this.player0.toLightuser(), player1: this.player1.toLightuser(), side: "right" })
        // this.players[0].emit('matchInfo', { gameStart: i} )  envoyer aussi aux spectateurs
        // this.players[1].emit('matchSetup', { gameStart: i} ) later send them starting info, paddle position, ball position etc
        for (let i: number = 3; i >= 0; --i) {
            this.players[0].emit('matchSetup', { gameStart: i} ) 
            this.players[1].emit('matchSetup', { gameStart: i} )
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