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
    onDelete: "CASCADE"
  })
  user : User

  @ManyToOne(() => User, {
    eager: true,
    onDelete: "CASCADE"
  })
  peer : User

  @Column()
  status : Friend_Status

  toJSON() {
    return {
      id: this.id,
      peer: this.peer.toLightuser(),
      status: this.status
    }
  }
}
