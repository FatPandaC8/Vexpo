import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity('user_role')
@Unique(['user', 'role'])
export class UserRole {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @Column()
  roleId: number;

  @ManyToOne(() => User, (user) => user.roles, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Role, (role) => role.users, {
    eager: true,
    onDelete: 'CASCADE',
  })
  role: Role;

  // later: @ManyToOne of org_id, expo_id, comp_id
}
