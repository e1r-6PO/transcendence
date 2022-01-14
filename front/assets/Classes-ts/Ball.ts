class Ball {
    x: number
    y: number
    width: number
    height: number

    constructor(x: number, y: number, w: number, h: number) {
        this.x = x
        this.y = y
        this.width = w
        this.height = h
    }

    draw(maptest: CanvasRenderingContext2D){
        maptest.beginPath()
        maptest.fillStyle = '#a5fafa' // ballcolors
        maptest.shadowColor = '#0affff';  // ballcolors
        maptest.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2)
        maptest.fill()
        maptest.closePath()
        maptest.beginPath()
        maptest.fillStyle = '#000000' // ballcolors
        maptest.shadowColor = '#000000';  // ballcolors
        maptest.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 4, 0, Math.PI * 2)
        maptest.fill()
        maptest.closePath()
    }
}
export { Ball }