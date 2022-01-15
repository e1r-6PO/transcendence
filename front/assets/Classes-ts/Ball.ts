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

    draw(maptest: CanvasRenderingContext2D){
        //ball color
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
        maptest.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2)
        maptest.fill()
        maptest.closePath()
        //disk effect
        maptest.beginPath()
        maptest.fillStyle = '#000000'
        maptest.shadowColor = '#000000';
        maptest.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 4, 0, Math.PI * 2)
        maptest.fill()
        maptest.closePath()
    }
}
export { Ball }