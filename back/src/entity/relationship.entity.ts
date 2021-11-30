import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "./user.entity";

export enum Friend_Status {
  completed = "completed",
  sent = "sent",
  incomming = "incomming",
  blocked = "blocked",
}

@Entity()
@Unique(["user", "peer"])
export class Relationship {
  @PrimaryGeneratedColumn()
  id : number

  @ManyToOne(() => User, {
    eager: true,
  })
  user : User

  @ManyToOne(() => User, {
    eager: true,
  })
  peer : User

  @Column()
  status : Friend_Status

  toJSON() {
    return {
      id: this.id,
      peer: {
        id: this.peer.id,
        picture: 'http://localhost:8000/api/users/' + this.peer.id + '/picture',
        nickName: this.peer.nickName,
        gameWin: this.peer.gameWin,
        gameLose: this.peer.gameLose,
      },
      status: this.status
    }
  }
}
