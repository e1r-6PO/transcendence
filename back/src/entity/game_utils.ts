export class Vect {
    x: number
    y: number

    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }

    get len()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    set len(value) {
        const f = value / this.len;
        this.x *= f;
        this.y *= f;
    }
}

export class Rect
{
    pos: Vect
    size: Vect

    constructor(x = 0, y = 0)
    {
        this.pos = new Vect(0, 0);
        this.size = new Vect(x, y);
    }
    get left()
    {
        return this.pos.x - this.size.x / 2;
    }
    get right()
    {
        return this.pos.x + this.size.x / 2;
    }
    get top()
    {
        return this.pos.y - this.size.y / 2;
    }
    get bottom()
    {
        return this.pos.y + this.size.y / 2;
    }
}
