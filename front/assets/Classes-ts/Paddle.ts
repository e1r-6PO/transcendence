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
		maptest.shadowBlur = 8
		maptest.fillRect(this.x, this.y, this.width, this.height)  
		maptest.closePath()
	}
}
export { Paddle }