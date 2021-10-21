import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column( { unique: true } )
  email: string;
  @Column()
  displayName: string;
  @Column()
  picture: string;

  @Column({
    //  unique: true
  })
  nickName: string;

  @Column()
  provider: string;
  @Column()
  provider_id: number;

  @Column({ default: true })
  isActive: boolean;
}
