import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  picture: string;
  @Column()
  accessToken: string;

  @Column({
    unique: true
  })
  logName: string;

  @Column({ default: true })
  isActive: boolean;
  // {
//   email: 'arthurvanpraet472@gmail.com',
//   firstName: 'Arthur',
//   lastName: 'Van Praet',
//   picture: 'https://lh3.googleusercontent.com/a/AATXAJx2MXvsSY04_MalQRaApP4buWGazpxtrCL6gXKW=s96-c',
//   accessToken: 'ya29.a0ARrdaM9o1rMZtwlEWZGZn0F2JUsi_2pdxnvsv30CaTIlTUdqzSkqUB5mQDQw9VpVpEZ4lmQmJUwlNG0XdwnxV3Y8Rc_CuynCRCYxKMzmxYDa6C9ORAVnbFo65ryk0neNGPAeZEp0z_MzWvmg-wdWvZTEonuU'
// }
}
