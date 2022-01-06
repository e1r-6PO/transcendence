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
}