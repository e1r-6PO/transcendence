import { Rect, Vect } from "./game_utils"
import { Paddle } from "./paddle.entity"

enum directions {
	stable = 0,
	positive = 1,
	negative = -1,
}

export class Ball extends Rect {
	canvas_x: number
	canvas_y: number
	// x: number
	// y: number
	xd: number
	yd: number
	// ball_size: number
	speed: Vect

	constructor()
	{
		super(10, 10)
		this.canvas_x = 840 // map width
		this.canvas_y = 600 // map height
		this.pos.x = this.canvas_x / 2, // middle of the map x
		this.pos.y = this.canvas_y / 2, // middle of the map y
		this.xd = Math.floor(Math.random() * 2) == 0 ? directions.negative : directions.positive // random x directions
		this.yd = Math.floor(Math.random() * 2) == 0 ? directions.negative : directions.positive // random y directions
		// this.ball_size = 18 / 2 // size in pixel in front, useful for the ball not to go in the edge in front
		this.speed = new Vect() // must be positive value, distance traveled per tick
	}

	// need to take paddle position as args
	tick() { // 0 = p0 lost a point, 1 = p1 lost a point -1 = nothing happned
			// const paddle0x = 0 + 40
			// let paddle0y = this.canvas_y / 2
			// const paddle1x = this.canvas_x - 40
			// let paddle1y = this.canvas_y / 2
			if (this.speed.x === 0 && this.speed.y === 0) {
				this.speed.x = 7 * (Math.random() > .5 ? 1 : -1);
				this.speed.y = 7 * (Math.random() * 2 - 1);
				this.speed.len = 8;
				console.log('BallSpeed: ' + this.speed.x + " " + this.speed.y)
			}

			this.pos.x += this.speed.x
			this.pos.y += this.speed.y

			if (this.left < 0) {
				// return 0
				// player 0 lost
				this.speed.x *= -1
			}
			if (this.right > this.canvas_x) {
				// return 1
				// player 1 lost
				this.speed.x *= -1
			}

			if (this.top < 0) {
				this.speed.y *= -1
			}
			if (this.bottom > this.canvas_y) {
				this.speed.y *= -1
        	}
			// if (this.speed.y < 0 && this.top < 0 ||
			// 	this.speed.y > 0 && this.bottom > this.canvas_y) {
			// 	this.speed.y = -this.speed.y;
			// }

			//collision paddle6 
			return -1
	}

	checkPaddleLeft(p: Paddle){
		// console.log('LEFT: Before Collision: ' + this.x + this.xd)
		if (p.right > this.left && p.left < this.right
			&& p.top + p.size.x < this.bottom - this.size.x && p.bottom + p.size.x > this.top - this.size.x)
		{
			this.speed.x *= -1
		}
		// console.log('LEFT After Collision: ' + this.x + this.xd)
	}

	checkPaddleRight(p: Paddle){
		// console.log('RIGTHT Before Collision: ' + this.x + this.xd)
		if (p.left < this.right && p.right > this.left
			&& p.top + p.size.x < this.bottom - this.size.x && p.bottom + p.size.x > this.top - this.size.x)
		{
			this.speed.x *= -1
		}
		// console.log('RIGHT After Collision: ' + this.x + this.xd)
	}
}