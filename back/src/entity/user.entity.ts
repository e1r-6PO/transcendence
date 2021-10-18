import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column( { unique: true } )
  email: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  picture: string;

  @Column({
    //  unique: true
  })
  nickName: string;

  @Column({ default: true })
  isActive: boolean;
}
