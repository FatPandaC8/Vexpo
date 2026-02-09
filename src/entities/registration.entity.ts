import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Expo } from './expo.entity';
import { User } from './user.entity';

@Entity('registration')
export class Registration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  expoId: number;

  @Column()
  userId: number;

  @ManyToOne(() => Expo, (expo) => expo.registrations, { onDelete: 'CASCADE' })
  expo: Expo;

  @ManyToOne(() => User, (user) => user.registrations, { onDelete: 'CASCADE' })
  user: User;
}
