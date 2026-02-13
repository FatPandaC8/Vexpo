import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Booth } from './booth.entity';

@Entity('visit')
@Index(['userId', 'boothId', 'visitedAt'])
export class Visit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  boothId: number;

  @Column({ type: 'int', default: 0 })
  durationInSeconds: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Booth)
  booth: Booth;

  @CreateDateColumn()
  visitedAt: Date;
}
