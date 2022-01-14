import { Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from './user.entity'
import { Messages } from './messages.entity'
import { ChannelParticipant } from "./channelParticipant.entity";
import { type } from "os";
import { LightChannel } from "./lightChannel.entity";

export enum ChannType {
    CHANNEL = "channel",
    DM = "dm"
}

export enum ChannAccess {
    PRIVATE = "Private",
    PROTECTED = "Protected",
    PUBLIC = "Public"
}

@Entity()
export class Channel {

    constructor() {
        this.id = 0;
        this.channName = "";
    }

    @PrimaryGeneratedColumn()
    id : number;

    @Column({ default: "", collation: "utf8mb4_bin",
    charset: "utf8mb4"})
    channName: string;
    
    @Column({ default: '' })
    channPass: string;

    @Column({ default: ChannType.CHANNEL})
    channType: string;

    @Column({ default: ChannAccess.PUBLIC })
    channAccess: string;

    @OneToMany(() => ChannelParticipant, channelParticipant => channelParticipant.channel, { cascade: true})
    channelParticipant: ChannelParticipant[];

    @OneToMany(() => Messages, messages => messages.channel)
    messages: Messages[];

    toLightChannel() {
        var light: LightChannel = new LightChannel()

        light.channAccess = this.channAccess
        light.channName = this.channName
        light.channPass = this.channPass
        light.channType = this.channType
        light.id = this.id
        return light
    }
}