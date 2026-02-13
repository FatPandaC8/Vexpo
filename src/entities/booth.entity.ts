import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
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
  status: 'pending' | 'approved' | 'rejected';

  @ManyToOne(() => Expo, (expo) => expo.booths)
  expo: Expo;

  @ManyToOne(() => Company, (company) => company.booths)
  company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
