import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserRole } from './userrole.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => UserRole, (ur) => ur.user)
  roles: UserRole[];
}
