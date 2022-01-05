import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class PrivateMessage {

  constructor() {
    this.date = new Date();
    this.message = '';
    this.picture = '';
    this.sender = new User();
    this.target = new User();
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, {
    eager: true,
    onDelete: 'CASCADE'
  })
  sender: User;

  @ManyToOne(() => User, {
    eager: true,
    onDelete: 'CASCADE'
  })
  target: User;

  @Column({default: 'message'})
  type: string; // message or game

  @Column({nullable: true, default: null})
  game_id: string // if type is message -> null

  @Column({nullable: true, default: null})
  game_state: string // pending, running, 

  @Column()
  message: string;

  @Column()
  picture: string;

  @Column()
  date: Date;
}