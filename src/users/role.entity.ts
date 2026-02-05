import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserRole } from './userrole.entity';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => UserRole, ur => ur.role)
  users: UserRole[];
}
