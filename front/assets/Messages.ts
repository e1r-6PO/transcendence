class Messages {

    id: number;
    senderId: number;
    message: string;
    time: Date;

    constructor()
    {
        this.id = 0;
        this.senderId = 0;
        this.message = "";
        this.time = new Date();
    }
}

export { Messages }