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
	// ball_size: number
	speed: Vect

	constructor()
	{
		super(10, 10)
		this.canvas_x = 840 // map width
		this.canvas_y = 600 // map height
		this.pos.x = this.canvas_x / 2, // middle of the map x
		this.pos.y = this.canvas_y / 2, // middle of the map y
		// this.ball_size = 18 / 2 // size in pixel in front, useful for the ball not to go in the edge in front
		this.speed = new Vect(0, 0) // must be positive value, distance traveled per tick
		console.log(this.speed)
		console.log('Ball : pos.x = ' + this.pos.x + ' pos.y = ' + this.pos.y + ' size.x = ' + this.size.x + ' size.y = ' + this.size.y + ' top = ' + this.top + ' bot = ' + this.bottom + ' left = ' + this.left + ' right = ' + this.right)
	}

	// need to take paddle position as args
	tick() { // 0 = p0 lost a point, 1 = p1 lost a point -1 = nothing happned
			// const paddle0x = 0 + 40
			// let paddle0y = this.canvas_y / 2
			// const paddle1x = this.canvas_x - 40
			// let paddle1y = this.canvas_y / 2
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

			if (this.top < 0 - this.size.x / 5) {
				this.speed.y *= -1
			}
			if (this.bottom  > this.canvas_y - this.size.x / 6) {
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
		if (this.left - this.size.x <= p.right && this.right + this.size.x >= p.right &&
			p.top + p.size.x < this.bottom - this.size.x && p.bottom + p.size.x > this.top - this.size.x)
		{
			let collision = p.pos.y - this.pos.y + 30
			this.speed.y = collision * .2
			console.log("PaddleLef: " + collision)
			this.speed.x *= -1
		}
		// console.log('LEFT After Collision: ' + this.x + this.xd)
	}

	checkPaddleRight(p: Paddle){
		// console.log('RIGTHT Before Collision: ' + this.x + this.xd)
		if (this.right >= p.left && this.left <= p.right
			&& p.top + p.size.x < this.bottom - this.size.x && p.bottom + p.size.x > this.top - this.size.x)
		{
			//ok sa touche
			let collision = p.pos.y - this.pos.y + 30
			this.speed.y = collision * .2
			console.log("PaddleRight: " + collision)
			this.speed.x *= -1
		}
		// console.log('RIGHT After Collision: ' + this.x + this.xd)
	}
}