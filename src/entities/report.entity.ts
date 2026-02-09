import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('report')
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  reason: string;

  @Column()
  status: boolean;

  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
