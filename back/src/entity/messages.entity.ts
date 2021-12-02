import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { User } from "./user.entity";

@Entity()
export class Messages {
    constructor()
    {
        this.senderId = 0;
        this.message = "";
        this.senderNick = "";
        this.time = new Date();
    }

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, {
        eager: true,
      })
    senderId: number;

    @Column()
    senderNick: string;

    @Column({
        // type: 'varchar',
        // length: 255,
        // nullable: false,
    })
    message: string;

    @Column({
        // type: 'timestamp',
        // default: () => 'CURRENT_TIMESTAMP'
    })
    time: Date;
}