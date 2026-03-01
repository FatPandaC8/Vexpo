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
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  name: string;

  // one company one exhibitor
  @Column({unique: true})
  exhibitorId: number;

  @Column()
  industry: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Booth, (booth) => booth.company)
  booths: Booth[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
