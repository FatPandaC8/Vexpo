import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Booth } from './booth.entity';

@Entity('company')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  exhibitorId: number;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  website: string;

  @Column()
  description: string;

  @OneToMany(() => Booth, (booth) => booth.company)
  booths: Booth[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
