import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Registration } from './registration.entity';
import { Booth } from './booth.entity';

@Entity('expo')
export class Expo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  organizerId: number;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  website: string;

  @OneToMany(() => Registration, (registration) => registration.expo)
  registrations: Registration[];

  @OneToMany(() => Booth, (booth) => booth.expo)
  booths: Booth[];
}
