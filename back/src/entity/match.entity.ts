import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Repository } from "typeorm"
import { User } from "./user.entity"

@Entity()
export class Match {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => User, {
        eager: true,
    })
    player0: User
    @ManyToOne(() => User, {
        eager: true,
    })
    player1: User

    @Column( {default: 0} )
    scorep0: number
    @Column( {default: 0} )
    scorep1: number
}