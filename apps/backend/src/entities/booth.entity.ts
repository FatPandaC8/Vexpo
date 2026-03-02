import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Expo } from './expo.entity';
import { Company } from './company.entity';

@Entity('booth')
@Unique(["exhibitorId", "expoId"]) // only one booth of exhibitor is allowed in this expo
@Unique(["expoId", "mapRow", "mapCol"]) // self explanatory 
export class Booth {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  expoId: string;

  @Column()
  exhibitorId: string;

  @Column()
  companyId: string;

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
