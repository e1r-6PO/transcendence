enum directions {
    stable = 0,
    positive = 1,
    negative = -1,
}

export class Ball {
    canvas_x: number
    canvas_y: number
    x: number
    y: number
    xd: number
    yd: number
    velocity: number

    constructor()
    {
        this.canvas_x = 700 // map width
        this.canvas_y = 500 // map height
        this.x = this.canvas_x / 2, // middle of the map x
        this.y = this.canvas_y / 2, // middle of the map y
        this.xd = Math.floor(Math.random() * 2) == 0 ? directions.negative : directions.positive // random x directions
        this.yd = Math.floor(Math.random() * 2) == 0 ? directions.negative : directions.positive // random y directions
        this.velocity = 1 // must be positive value, distance traveled per tick
    }

    tick() {
        this.x += this.velocity * this.xd
        this.y += this.velocity * this.yd
        if (this.x < 0) {
            this.xd = directions.positive
            this.x = 0
        }
        if (this.y < 0) {
            this.yd = directions.positive
            this.y = 0
        }
        if (this.x > this.canvas_x) {
            this.xd = directions.negative
            this.x = this.canvas_x
        }
        if (this.y > this.canvas_y) {
            this.yd = directions.negative
            this.y = this.canvas_y
        }
    }
}