export enum ChannAccess {
    PRIVATE = "Private",
    PROTECTED = "Protected",
    PUBLIC = "Public"
}

interface IMessages {
    id: number;
    senderId: number;
    senderNick: string;
    message: string;
    time: Date;
}

class Messages {

    id: number;
    senderId: number;
    senderNick: string;
    message: string;
    picture: string;
    time: Date;

    constructor();
    constructor(msg: IMessages);
    constructor(msg?: any)
    {
        this.id = msg && msg.id || 0;
        this.senderId = msg && msg.senderId || 0;
        this.senderNick = msg && msg.senderNick || "";
        this.message = msg && msg.message || "";
        this.time = msg && msg.time || new Date();
        this.picture = msg && msg.picture || "";
    }
}

export { Messages }