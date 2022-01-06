class Paddle {
    constructor (x: number, y: number){
			this.x = x;
			this.y = y;
			this.width = 15;
			this.height = 60;
			this.speed = 20;
    }

	moveUp(){
		let res = this.y - this.speed;
		if (res < 0)
			this.y = 0;
		else
			this.y -= this.speed;
	}
	
	moveDown(){
		let res = this.y + this.speed;
		if (res + this.height > 600)
			this.y = 600 - this.height;
		else
			this.y += this.speed;
	}

		x: number;
		y: number;
		width: number;
		height: number;
		speed: number;
}
export { Paddle }