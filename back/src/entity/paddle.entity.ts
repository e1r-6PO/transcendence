import { Vect, Rect } from './game_utils'

export class Paddle extends Rect{
  canvas_x: number
	canvas_y: number
	speed: Vect

	constructor(x: number, y: number) {
		super(20, 60)
		this.pos.x = x
		this.pos.y = y
		this.canvas_x = 840 // map width
		this.canvas_y = 600 // map height
		this.speed = new Vect(0, 35)
		console.log('Paddle : pos.x = ' + this.pos.x + ' pos.y = ' + this.pos.y + ' size.x = ' + this.size.x + ' size.y = ' + this.size.y + ' top = ' + this.top + ' bot = ' + this.bottom + ' left = ' + this.left + ' right = ' + this.right)
	}

	moveUp(){
		let res = this.pos.y - this.speed.y;
		if (res < 0)
			this.pos.y = 0;
		else
			this.pos.y -= this.speed.y;
	}
	
	moveDown(){
		let res = this.pos.y + this.speed.y;
		if (res + this.size.y > 600)
			this.pos.y = 600 - this.size.y;
		else
			this.pos.y += this.speed.y;
	}
}