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
    ball_size: number
    velocity: number

    constructor()
    {
        this.canvas_x = 840 // map width
        this.canvas_y = 600 // map height
        this.x = this.canvas_x / 2, // middle of the map x
        this.y = this.canvas_y / 2, // middle of the map y
        this.xd = Math.floor(Math.random() * 2) == 0 ? directions.negative : directions.positive // random x directions
        this.yd = Math.floor(Math.random() * 2) == 0 ? directions.negative : directions.positive // random y directions
        this.ball_size = 18 / 2 // size in pixel in front, useful for the ball not to go in the edge in front
        this.velocity = 1 // must be positive value, distance traveled per tick
    }

    // need to take paddle position as args
    tick() { // 0 = p0 lost a point, 1 = p1 lost a point -1 = nothing happned
        // const paddle0x = 0 + 40
        // let paddle0y = this.canvas_y / 2
        // const paddle1x = this.canvas_x - 40
        // let paddle1y = this.canvas_y / 2

        this.x += this.velocity * this.xd
        this.y += this.velocity * this.yd
        if (this.x < 0 + this.ball_size) {
            return 0
            // player 0 lost
            this.xd = directions.positive
            this.x = 0 + this.ball_size
        }
        if (this.y < 0 + this.ball_size) {
            this.yd = directions.positive
            this.y = 0 + this.ball_size
        }
        if (this.x > this.canvas_x - this.ball_size) {
            return 1
            // player 1 lost
            this.xd = directions.negative
            this.x = this.canvas_x - this.ball_size
        }
        if (this.y > this.canvas_y - this.ball_size) {
            this.yd = directions.negative
            this.y = this.canvas_y - this.ball_size
        }
        return -1
    }
}