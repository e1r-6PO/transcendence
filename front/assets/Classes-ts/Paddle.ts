class Paddle {
	x: number
	y: number
	width: number
	height: number
	color: string
	shadowColor: string

    constructor (c: string){
			this.x = 0
			this.y = 0
			this.width = 0
			this.height = 0
			this.color = c
			this.shadowColor = ""
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
		else if (this.color == 'white')
			this.shadowColor = 'grey'
		else
			this.shadowColor = 'dark' + this.color
		ctx.shadowColor = this.shadowColor
		ctx.shadowBlur = 8
		ctx.fillRect(this.x, this.y, this.width, this.height)  
		ctx.closePath()
	}
}
export { Paddle }