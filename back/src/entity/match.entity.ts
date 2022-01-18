import { Type } from "class-transformer"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Repository } from "typeorm"
import { User } from "./user.entity"

@Entity()
export class Match {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Type(() => User)
    @ManyToOne(() => User, {
        eager: true,
    })
    player0: User

    @Type(() => User)
    @ManyToOne(() => User, {
        eager: true,
    })
    player1: User

    @Column( {default: 0} )
    scorep0: number
    @Column( {default: 0} )
    scorep1: number

    @Type(() => User)
    @ManyToOne(() => User, {
        eager: true,
    })
    winner: User

    @Column({ default: "" })
    mod: string

    @Column()
    date: Date

    toSafeFormat() {
        return {
            id: this.id,
            player0: this.player0.toLightuser(),
            player1: this.player1.toLightuser(),
            scorep0: this.scorep0,
            scorep1: this.scorep1,
            winner: this.winner.toLightuser(),
            mod: this.mod,
            date: this.date
        }
    }
}