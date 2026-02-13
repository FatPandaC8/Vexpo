import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
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
  description?: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending'
  })
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';

  @ManyToOne(() => User, (user) => user.reports)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
