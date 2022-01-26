import { LightUser } from "./User";

function clear_canvas(ctx: CanvasRenderingContext2D, w: number, h: number){
	ctx.shadowOffsetY = 0
	ctx.shadowOffsetX = 0
	ctx.shadowColor = 'black'
	ctx.shadowBlur = 0;
	ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'
	ctx.fillRect(0, 0, w, h);
}

function drawCountdown(ctx: CanvasRenderingContext2D, w: number, h: number, info: any, player0: LightUser, player1: LightUser){
	var color = ""

	ctx.clearRect(0, 0, w, h);
	if (info['gameStart'] == 3)
		color = player0.paddleColor
	else if (info['gameStart'] == 2)
		color = player1.paddleColor
	else
		color = 'white'
	ctx.fillStyle = color
	if (color == 'purple')
		ctx.shadowColor = 'rebeccapurple'
	else if (color == 'yellow')
		ctx.shadowColor = 'goldenrod'
	else if (color == 'pink')
		ctx.shadowColor = 'darkviolet'
	else if (color == 'white')
		ctx.shadowColor = 'grey'
	else
		ctx.shadowColor = 'dark' + color
	ctx.shadowBlur = 20
	ctx.shadowOffsetY = 25
	ctx.shadowOffsetX = 25
	ctx.font = '150px OrbitronM'
	ctx.textAlign = 'center'
	if (info['gameStart'] == 0)
		ctx.fillText("GO!", w / 2, 320);
	else
		ctx.fillText(info['gameStart'], w / 2, 320);
}

function drawGameEnded(ctx: CanvasRenderingContext2D, w: number, h: number){
	ctx.clearRect(0, 0, w, h);
	ctx.shadowColor = "grey"
	ctx.shadowBlur = 20
	ctx.shadowOffsetY = 25
	ctx.shadowOffsetX = 25
	ctx.font = '100px OrbitronM'
	ctx.textAlign = 'center'
	ctx.fillStyle = "white"
	ctx.fillText("Game Ended", w / 2, 320);
}

const Render = {
	clear_canvas,
	drawCountdown,
	drawGameEnded
}

export default Render