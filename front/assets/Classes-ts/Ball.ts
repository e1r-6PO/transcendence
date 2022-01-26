class Ball {
    x: number
    y: number
    width: number
    height: number
    color: string
    shadowColor: string

    constructor(x: number, y: number, w: number, h: number) {
        this.x = x
        this.y = y
        this.width = w
        this.height = h
        this.color = "cyan"
        this.shadowColor = "darkcyan"
    }

    draw(ctx: CanvasRenderingContext2D){
        //ball color
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
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
        //disk effect
        ctx.beginPath()
        ctx.fillStyle = '#000000'
        ctx.shadowColor = '#000000';
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }
}
export { Ball }