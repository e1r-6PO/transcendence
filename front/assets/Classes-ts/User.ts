class User {
    id: number;
    nickName: string;
    email: string;
    provider: string;
    picture: string;
    displayName: string;
    provider_id: string;
    twoFactorAuthenticationSecret: string;
    isTwoFactorAuthenticationEnabled: boolean;
    isActive: boolean;
    gameWin: number;
    gameLose: number;
    paddleColor: string;

    constructor()
    {
        this.nickName = "";
        this.email = "";
        this.provider = "";
        this.picture = "";
        this.id = 0;
        this.displayName = "";
        this.provider_id = "";
        this.twoFactorAuthenticationSecret = "";
        this.isTwoFactorAuthenticationEnabled = false;
        this.isActive = false;
        this.gameWin = 0;
        this.gameLose = 0;
        this.paddleColor = "";
    }
}

class LightUser {
    id: number;
    picture: string;
    nickName: string;
    gameWin: number;
    gameLose: number;
    isActive: boolean;
    paddleColor: string;
    constructor()
    {
        this.nickName = "";
        this.picture = "";
        this.id = 0;
        this.gameWin = 0;
        this.gameLose = 0;
        this.isActive = false;
        this.paddleColor = ""
    }
}

export { User, LightUser };