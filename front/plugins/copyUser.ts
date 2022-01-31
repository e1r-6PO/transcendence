import { LightUser } from "~/assets/Classes-ts/User";

function copyLightUser(to: LightUser, from: LightUser) {
  to.nickName = from.nickName
  to.picture = from.picture + '?' + new Date().getTime()
  to.id = from.id;
  to.elo = parseFloat(parseFloat(from.elo as any).toFixed(0));
  to.gameWin = from.gameWin;
  to.gameLose = from.gameLose;
  to.isActive = from.isActive;
  to.currentGame = from.currentGame;
  to.paddleColor = from.paddleColor;
}

export default copyLightUser