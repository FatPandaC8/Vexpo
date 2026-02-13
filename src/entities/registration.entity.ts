import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Expo } from './expo.entity';
import { User } from './user.entity';

@Entity('registration')
@Unique(['expoId', 'userId']) // unique the pair, not each one in the array
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

  @CreateDateColumn()
  registeredAt: Date;
}
