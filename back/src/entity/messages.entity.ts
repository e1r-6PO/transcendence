import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Messages {
    constructor()
    {
        this.senderId = 0;
        this.message = "";
        this.time = new Date();
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    senderId: number;

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