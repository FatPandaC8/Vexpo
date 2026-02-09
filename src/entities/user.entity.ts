import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserRole } from './userrole.entity';
import { Registration } from './registration.entity';
import { Report } from './report.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password?: string;

  @OneToMany(() => UserRole, (ur) => ur.user)
  roles: UserRole[];

  @OneToMany(() => Registration, (registration) => registration.user)
  registrations: Registration[];

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
}
