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
	speed: Vect
	collision: number
	color: string
	lastPaddleHit: number // -1 for none, 0 for p0, 1 for p1
	lastWallHit: number // -1 for none, 0 for top, 1 for bot
	s: number

	constructor()
	{
		super(15, 15)
		this.canvas_x = 840 // map width
		this.canvas_y = 600 // map height
		this.pos.x = this.canvas_x / 2 - this.size.x / 2, // middle of the map x
		this.pos.y = this.canvas_y / 2 - this.size.y / 2, // middle of the map y
		// this.ball_size = 18 / 2 // size in pixel in front, useful for the ball not to go in the edge in front
		this.speed = new Vect(0, 0) // must be positive value, distance traveled per tick
		this.collision = 0
		this.color = 'white'
		this.lastPaddleHit = -1
		this.lastWallHit = -1
		this.s = 4
	}

	tickWrapper(n: number) {
		var ret: string
		this.collision = 0
		for (var i = 0; i < n; ++i) {
			ret = this.tick()
			if (ret != '')
				return ret
		}
	}

	// need to take paddle position as args
	tick() { // 0 = p0 lost a point, 1 = p1 lost a point -1 = nothing happned
		this.pos.x += this.speed.x
		this.pos.y += this.speed.y
		if (this.left < 0 + this.size.x / 2) {
			return 'p1+1'
			// player 0 lost
			this.speed.x *= -1
			this.collision = 1
		}
		if (this.right > this.canvas_x - this.size.x / 2) {
			return 'p0+1'
			// player 1 lost
			this.speed.x *= -1
			this.collision = 1
		}
		if (this.top < 0 + this.size.x / 2 && this.lastWallHit != 0) {
			this.speed.y *= -1
			this.collision = 1
			this.lastWallHit = 0
		}
		if (this.bottom > this.canvas_y - this.size.x / 2 && this.lastWallHit != 1) {
			this.speed.y *= -1
			this.collision = 1
			this.lastWallHit = 1
		}

		return ''
	}

	checkPaddleLeft(p: Paddle){
		if (p.left < this.right && p.right > this.left &&
        p.top < this.bottom && p.bottom > this.top &&
		this.lastPaddleHit != 0) {

			var pos = (this.pos.y - p.pos.y) * (1 / ((p.size.y / 2) + this.size.y / 2)) // give a number between -1 and 1 (excluded) wich tells where the ball hit the paddle
			var rebond = pos * (4 * Math.PI) / 12
			this.speed.y = this.s * (Math.sin(rebond))
			this.speed.x = this.s * (Math.cos(rebond))
	
			this.s *= 1.05

			this.collision = 2
			this.color = p.color
			this.lastPaddleHit = 0 // p0 is last to have it the ball
			this.lastWallHit = -1 // reset lastwallit to let the ball touche the same wall it went from
		}
	}

	checkPaddleRight(p: Paddle){
		if (p.left < this.right && p.right > this.left &&
    	p.top < this.bottom && p.bottom > this.top &&
		this.lastPaddleHit != 1) {

			var pos = (this.pos.y - p.pos.y) * (1 / ((p.size.y / 2) + this.size.y / 2)) // give a number between -1 and 1 (excluded) wich tells where the ball hit the paddle
			var rebond = pos * (4 * Math.PI) / 12
			this.speed.y = this.s * (Math.sin(rebond))
			this.speed.x = this.s * -(Math.cos(rebond))

			this.s *= 1.05

			this.collision = 3
			this.color = p.color
			this.lastPaddleHit = 1 // p1 is last to have hit it
			this.lastWallHit = -1 // reset lastwallit to let the ball touche the same wall it went from
        }
	}
}
