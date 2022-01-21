import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Achievements {

  constructor();
  constructor(user: User, action: string, title: string, count: number, goal: number, icon: string);
  constructor(user?: User, action?: string, title?: string, count?: number, goal?: number, icon?: string) {
    this.user = user || new User()
    this.action = action || ""
    this.title = title || ""
    this.count = count || 0
    this.goal = goal || 0
    this.icon = icon || ""
  }
  
  
  @PrimaryGeneratedColumn()
  id: Number;

  @ManyToOne(() => User, { onDelete: 'CASCADE'})
  user: User;

  @Column({ default: "" })
  action: string;
  
  @Column({ default: "" })
  title: string;

  @Column({ default: 0 })
  count: number;

  @Column({ default: 0 })
  goal: number;

  @Column({ default: "" })
  icon: string;
}