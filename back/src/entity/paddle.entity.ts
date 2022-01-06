export class Paddle {
  canvas_x: number
	canvas_y: number
	x: number
	y: number
	width: number
	height: number
	speed: number

	constructor(x: number, y: number) {
		this.canvas_x = 840 // map width
		this.canvas_y = 600 // map height
		this.x = x
		this.y = y
		this.width = 15
		this.height = 60
		this.speed = 60
	}

	moveUp(){
		console.log(this.y)
		let res = this.y - this.speed;
		if (res < 0)
			this.y = 0;
		else
			this.y -= this.speed;
		console.log(this.y)
	}
	
	moveDown(){
		console.log(this.y)
		let res = this.y + this.speed;
		if (res + this.height > 600)
			this.y = 600 - this.height;
		else
			this.y += this.speed;
		console.log(this.y)
	}
}