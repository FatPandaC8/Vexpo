import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expo } from './expo.entity';
import { Company } from './company.entity';

@Entity('booth')
export class Booth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  expoId: number;

  @Column()
  exhibitorId: number;

  @Column({ nullable: true })
  companyId: number | null;

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  modelPath: string;

  @ManyToOne(() => Expo, (expo) => expo.booths)
  @JoinColumn({ name: 'expoId' })
  expo: Expo;

  @ManyToOne(() => Company, (company) => company.booths, { nullable: true })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}