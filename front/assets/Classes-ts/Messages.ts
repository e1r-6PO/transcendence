import { User } from "./User";

export enum ChannAccess {
    PRIVATE = "Private",
    PROTECTED = "Protected",
    PUBLIC = "Public"
}

export enum MessagesType {
    DEFAULT = "default",
    SERVER = "server",
}

interface IMessages {
    id: number;
    sender: User;
    senderNick: string;
    message: string;
    time: Date;
}

class Messages {

    id: number;
    sender: User;
    senderNick: string;
    message: string;
    picture: string;
    time: Date;
    type: MessagesType;

    constructor();
    constructor(msg: IMessages);
    constructor(msg?: any)
    {
        this.id = msg && msg.id || 0;
        this.sender = msg && msg.sender || 0;
        this.senderNick = msg && msg.senderNick || "";
        this.message = msg && msg.message || "";
        this.time = msg && msg.time || new Date();
        this.picture = msg && msg.picture || "";
        this.type = msg && msg.type || MessagesType.DEFAULT
    }
}

export { Messages }