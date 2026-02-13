import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('log')
@Index(['userId'])
@Index(['action'])
@Index(['createdAt'])
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number;

  @Column()
  action: string;

  @Column()
  header: string;

  @Column({ nullable: true })
  reason: string;

  @Column({ nullable: true })
  ipAddress: string;

  @CreateDateColumn()
  createdAt: Date;
}
