import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm"
import { Channel } from "./channel.entity";
import { User } from "./user.entity";

export enum Messages_type {
    default = "default",
    server = "server"
}

@Entity()
export class Messages {
    constructor()
    {
        this.sender = null;
        this.message = "";
        this.senderNick = "";
        this.time = new Date();
        this.picture = "";
        this.type = Messages_type.default;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, {
        eager: true,
        onDelete: "CASCADE"
      })
    sender: User;

    @Column()
    senderNick: string;

    @Column({})
    message: string;

    @Column({})
    time: Date;
    
    @Column()
    picture: string;

    @Column()
    type: Messages_type;

    @ManyToOne(() => Channel, { onDelete: "CASCADE"})
    channel: Channel;

    toJSON() {
        return {
            id: this.id,
            sender: this.sender.toLightuser(),
            senderNick: this.sender.nickName,
            message: this.message,
            time: this.time,
            picture: this.sender.toLightuser().picture,
            channel: this.channel,
            type: this.type,
        }
    }
}