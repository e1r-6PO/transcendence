import { forwardRef, Inject } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { BroadcastOperator, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { GameService } from "src/service/game.service"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Repository } from "typeorm"
import { Ball } from "./ball.entity"
import { Paddle } from "./paddle.entity"
import { User } from "./user.entity"

export class Game {
	constructor(gameService: GameService, winning_score: number, ball_amount: number) {
		this.gameService = gameService
		this.ball_amount = ball_amount
		this.winning_score = winning_score
	}

	id: string

	status: string = "idle" // idle, paused, started, forfeitp0, forfeitp1
	type: string
	gameService: GameService
	winning_score: number
	loopId: any
	player0socket: Socket | null = null
	player1socket: Socket | null = null
	// spectators: Array<Socket>
	balls: Array<Ball>
	ball_amount: number
	room: BroadcastOperator<DefaultEventsMap>

	player0: User
	player1: User

	paddle0: Paddle
	paddle1: Paddle

	scorep0: number = 0

	scorep1: number = 0

	async create_new_ball(time: number) {
		await new Promise(f => setTimeout(f, time));
		this.balls.push(new Ball)
	}

	async create_paddles(){
		this.paddle0 = new Paddle(20, 300)
		this.paddle1 = new Paddle(805, 300)
	}

	tick() {
		let ballsinfo = []
		for (let i = 0; i < this.balls.length; ++i) {
				var score = this.balls[i].tick();
				if (score == 0) {
						this.scorep1++
						ballsinfo.push({ id: i, status: "erased", ball_location: [this.balls[i].pos.x, this.balls[i].pos.y] })
						this.balls.splice(i, 1)
						this.create_new_ball(1000)
						if (this.scorep1 == this.winning_score) {
								this.gameService.endgame(this)
								return
						}
				}
				else if (score == 1) {
						this.scorep0++
						ballsinfo.push({ id: i, status: "erased", ball_location: [this.balls[i].pos.x, this.balls[i].pos.y] })
						this.balls.splice(i, 1)
						this.create_new_ball(1000)
						if (this.scorep0 == this.winning_score) {
								this.gameService.endgame(this)
								return
						}
				}
				else {
					this.balls[i].checkPaddleLeft(this.paddle0)
					this.balls[i].checkPaddleRight(this.paddle1)
					ballsinfo.push({ id: i, status: "normal", ball_info: [this.balls[i].pos.x, this.balls[i].pos.y, this.balls[i].size.x, this.balls[i].size.y] })
				}
		}
		//emit game info & balls info
		this.room.emit('gameInfo', ballsinfo)
		//emit paddle locations
		this.room.emit('paddleInfo', {paddle0_info: [this.paddle0.pos.x, this.paddle0.pos.y, this.paddle0.size.x, this.paddle0.size.y],
										paddle1_info:[this.paddle1.pos.x, this.paddle1.pos.y, this.paddle1.size.x, this.paddle1.size.y]})
	}

	matchinfo() {
		this.room.emit('matchInfo', { id: this.id, player0: this.player0.toLightuser(), player1: this.player1.toLightuser() }) 
	}

	async start() {
		this.status = "started"
		this.room.emit('matchFound', { id: this.id})
		// this.players[1].emit('matchFound', { id: this.id})
		await new Promise(f => setTimeout(f, 250)); // awaiting client switching page client side, rly ?
		this.matchinfo()
		for (let i: number = 3; i >= 0; --i) {
				this.room.emit('matchSetup', { gameStart: i} ) 
				await new Promise(f => setTimeout(f, 1000)); // countdown
		}
		this.balls = new Array
		for (let i = 0; i < this.ball_amount; ++i)
				this.create_new_ball(i * 1000)
		
		//paddles
		this.create_paddles()
		this.loopId = setInterval(this.tick.bind(this), 1000 / 20)
	}

	pause() { // client is the client that disconnected
		this.status = "paused"
		clearInterval(this.loopId)
	}

	unpause() {
		this.status = "paused"
		this.loopId = setInterval(this.tick.bind(this), 1000 / 20)
	}

	stop() {
		clearInterval(this.loopId)
		this.loopId = null
	}
}