function randomIntFromRange(min: number, max: number){
	return Math.floor(Math.random() * (max - min + 1) + min)
}

class Particle{
	x: number
	y: number
	radius: number
	color: string
	shadowColor: string
	velocity = { x: randomIntFromRange(-1.15, 1.15), y: randomIntFromRange(-1.15, 1.15)}
	ttl = 20

	constructor(x: number, y: number, r: number, c: string){
		this.x = x
		this.y = y
		this.radius = r
		this.color = c
		this.shadowColor = c
	}

	draw(ctx: CanvasRenderingContext2D){
		ctx.beginPath()
		ctx.fillStyle = this.color
        if (this.color == 'purple')
            this.shadowColor = 'rebeccapurple'
        else if (this.color == 'yellow')
            this.shadowColor = 'goldenrod'
        else if (this.color == 'pink')
            this.shadowColor = 'darkviolet'
        else
            this.shadowColor = 'dark' + this.color
        ctx.shadowColor = this.shadowColor
		ctx.fillStyle = this.color // ballcolors
		ctx.shadowColor = this.shadowColor  // ballcolors
		ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2, false)
		ctx.fill()
		ctx.closePath()
	}

	update(ctx: CanvasRenderingContext2D){
		this.draw(ctx)
		this.x += this.velocity.x
		this.y += this.velocity.y
		this.ttl -= 1
	}
}
export { Particle }
