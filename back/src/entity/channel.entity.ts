import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from './user.entity'
import { Messages } from './messages.entity'

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

    @ManyToOne(() => User, {
        eager: true
    })
    userList: User[]

    // @Column()
    // messageList: Messages[]
}