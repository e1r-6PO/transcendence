function randomIntFromRange(min: number, max: number){
	return Math.floor(Math.random() * (max - min + 1) + min)
}

class Particle{
	x: number
	y: number
	radius: number
	color: string
	velocity = { x: randomIntFromRange(-2, 2), y: randomIntFromRange(-2, 2)}
	ttl = 30

	constructor(x: number, y: number, r: number, c: string){
		this.x = x
		this.y = y
		this.radius = r
		this.color = c
	}

	draw(maptest: CanvasRenderingContext2D){
		maptest.beginPath()
		maptest.fillStyle = '#a5fafa' // ballcolors
		maptest.shadowColor = '#0affff';  // ballcolors
		maptest.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2, false)
		maptest.fill()
		maptest.closePath()
	}

	update(maptest: CanvasRenderingContext2D){
		this.draw(maptest)
		this.x += this.velocity.x
		this.y += this.velocity.y
		this.ttl -= 1
	}
}
export { Particle }
