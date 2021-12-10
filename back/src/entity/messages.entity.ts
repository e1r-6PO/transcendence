import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm"
import { Channel } from "./channel.entity";
import { User } from "./user.entity";

@Entity()
export class Messages {
    constructor()
    {
        this.sender = null;
        this.message = "";
        this.senderNick = "";
        this.time = new Date();
        this.picture = "";
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

    @ManyToOne(() => Channel, { onDelete: "CASCADE"})
    channel: Channel;
}