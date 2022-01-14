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
	collision: boolean

	constructor()
	{
		super(15, 15)
		this.canvas_x = 840 // map width
		this.canvas_y = 600 // map height
		this.pos.x = this.canvas_x / 2 - this.size.x / 2, // middle of the map x
		this.pos.y = this.canvas_y / 2 - this.size.y / 2, // middle of the map y
		// this.ball_size = 18 / 2 // size in pixel in front, useful for the ball not to go in the edge in front
		this.speed = new Vect(0, 0) // must be positive value, distance traveled per tick
		this.collision = false
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
			this.collision = false
			if (this.left < 0 + this.size.x / 2) {
				// return 0
				// player 0 lost
				this.speed.x *= -1
				this.collision = true
			}
			if (this.right > this.canvas_x - this.size.x / 2) {
				// return 1
				// player 1 lost
				this.speed.x *= -1
				this.collision = true
			}
			if (this.top < 0 + this.size.x / 2) {
				this.speed.y *= -1
				this.collision = true
			}
			if (this.bottom > this.canvas_y - this.size.x / 2) {
				this.speed.y *= -1
				this.collision = true
        	}
			// if (this.speed.y < 0 && this.top < 0 ||
			// 	this.speed.y > 0 && this.bottom > this.canvas_y) {
			// 	this.speed.y = -this.speed.y;
			// }

			//collision paddle6 
			return -1
	}

	checkPaddleLeft(p: Paddle){
		if (p.left < this.right && p.right > this.left &&
            p.top < this.bottom && p.bottom > this.top) {
            this.speed.x *= -1.0;
			var pos = (this.pos.y - p.pos.y) * (1 / ((p.size.y / 2) + this.size.y / 2)) // give a number between -1 and 1 (excluded) wich tells where the ball hit the paddle
			this.speed.y = pos * 10 // (10 is arbitrary)
			this.collision = true
		}
	}

	checkPaddleRight(p: Paddle){
		if (p.left < this.right && p.right > this.left &&
            p.top < this.bottom && p.bottom > this.top) {
            this.speed.x *= -1.0;
			var pos = (this.pos.y - p.pos.y) * (1 / ((p.size.y / 2) + this.size.y / 2)) // give a number between -1 and 1 (excluded) wich tells where the ball hit the paddle
			this.speed.y = pos * 10 // (10 is arbitrary)
			this.collision = true
        }
	}
}