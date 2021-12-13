import { Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from './user.entity'
import { Messages } from './messages.entity'
import { ChannelParticipant } from "./channelParticipant.entity";

@Entity()
export class Channel {

    constructor() {
        this.id = 0;
        this.channName = "";
        this.channType = "";
    }

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    channName: string;

    @Column()
    channType: string;

    @OneToMany(() => ChannelParticipant, channelParticipant => channelParticipant.channel, { cascade: true})
    channelParticipant: ChannelParticipant[];

    @OneToMany(() => Messages, messages => messages.channel)
    messages: Messages[];
}