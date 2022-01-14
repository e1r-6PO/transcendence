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
		super(15, 15)
		this.canvas_x = 840 // map width
		this.canvas_y = 600 // map height
		this.pos.x = this.canvas_x / 2 - this.size.x / 2, // middle of the map x
		this.pos.y = this.canvas_y / 2 - this.size.y / 2, // middle of the map y
		// this.ball_size = 18 / 2 // size in pixel in front, useful for the ball not to go in the edge in front
		this.speed = new Vect(0, 0) // must be positive value, distance traveled per tick
		console.log(this.speed)
		console.log('Ball : pos.x = ' + this.pos.x + ' pos.y = ' + this.pos.y + ' size.x = ' + this.size.x + ' size.y = ' + this.size.y + ' top = ' + this.top + ' bot = ' + this.bottom + ' left = ' + this.left + ' right = ' + this.right)
	}

	// need to take paddle position as args
	tick() { // 0 = p0 lost a point, 1 = p1 lost a point -1 = nothing happned
		this.pos.x += this.speed.x
		this.pos.y += this.speed.y

		if (this.left < 0 + this.size.x / 2) {
			// return { status: 'p1+1'}
			// player 0 lost
			this.speed.x *= -1
		}
		if (this.right > this.canvas_x - this.size.x / 2) {
			// return { status: 'p0+1'}
			// player 1 lost
			this.speed.x *= -1
		}

		if (this.top < 0 + this.size.x / 2) {
			this.speed.y *= -1
		}
		if (this.bottom > this.canvas_y - this.size.x / 2) {
			this.speed.y *= -1
		}

		return { status: ''}
	}

	checkPaddleLeft(p: Paddle){
		if (p.left < this.right && p.right > this.left &&
            p.top < this.bottom && p.bottom > this.top) {
            this.speed.x *= -1.05;
			var pos = (this.pos.y - p.pos.y) * (1 / ((p.size.y / 2) + this.size.y / 2)) // give a number between -1 and 1 (excluded) wich tells where the ball hit the paddle
			this.speed.y = pos * 6 // (10 is arbitrary)
		}
	}

	checkPaddleRight(p: Paddle){
		if (p.left < this.right && p.right > this.left &&
            p.top < this.bottom && p.bottom > this.top) {
            this.speed.x *= -1.05;
			var pos = (this.pos.y - p.pos.y) * (1 / ((p.size.y / 2) + this.size.y / 2)) // give a number between -1 and 1 (excluded) wich tells where the ball hit the paddle
			this.speed.y = pos * 6 // (10 is arbitrary)
        }
	}
}