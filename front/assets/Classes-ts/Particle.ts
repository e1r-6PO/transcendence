function randomIntFromRange(min: number, max: number){
	return Math.floor(Math.random() * (max - min + 1) + min)
}

class Particle{
	x: number
	y: number
	radius: number
	color: string
	shadowColor: string
	velocity = { x: randomIntFromRange(-2, 2), y: randomIntFromRange(-2, 2)}
	ttl = 30

	constructor(x: number, y: number, r: number, c: string){
		this.x = x
		this.y = y
		this.radius = r
		this.color = c
		this.shadowColor = c
	}

	draw(maptest: CanvasRenderingContext2D){
		maptest.beginPath()
		maptest.fillStyle = this.color
        if (this.color == 'purple')
            this.shadowColor = 'rebeccapurple'
        else if (this.color == 'yellow')
            this.shadowColor = 'goldenrod'
        else if (this.color == 'pink')
            this.shadowColor = 'darkviolet'
        else
            this.shadowColor = 'dark' + this.color
        maptest.shadowColor = this.shadowColor
		maptest.fillStyle = this.color // ballcolors
		maptest.shadowColor = this.shadowColor  // ballcolors
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
