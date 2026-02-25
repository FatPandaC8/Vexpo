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

  @Column()
  companyId: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  modelPath: string;

  @Column({ type: 'int' })
  mapRow: number;

  @Column({ type: 'int' })
  mapCol: number;

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
