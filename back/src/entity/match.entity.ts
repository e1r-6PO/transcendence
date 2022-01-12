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

    @ManyToOne(() => User, {
        eager: true,
    })
    winner: User

    toSafeFormat() {
        return {
            id: this.id,
            player0: this.player0.toLightuser(),
            player1: this.player1.toLightuser(),
            scorep0: this.scorep0,
            scorep1: this.scorep1,
            winner: this.winner.toLightuser()
        }
    }
}