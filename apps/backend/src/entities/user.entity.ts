import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Role } from './role.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @OneToOne(() => Role, (ur) => ur.user)
  role: Role;
}
