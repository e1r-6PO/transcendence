class Particles{
	
	constructor(x: number, y: number, r: number, c: any){
		this.x = x
		this.y = y
		this.radius = r
		this.color = c
	}

	x: number
	y: number
	radius: number
	color: any
	velocity = { x: 0, y: 3}
	friction = 0.8
	gravity = 1
}
export { Particles }
