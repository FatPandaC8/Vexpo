import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { UserRole } from 'src/entities/userrole.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['roles', 'roles.role'], // if no relation, user will be loaded with no role
      // if only have roles, user's role attribute will be empty
      // if have roles.role, user's role attribute is loaded with roles
    });
  }

  async findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.role'],
      lock: {
        mode: 'pessimistic_read',
      },
    });
  }

  async findAll() {
    return this.usersRepository.find({
      relations: ['roles', 'roles.role'],
      select: ['id', 'name', 'email'],
    });
  }

  async createUserOnly(data: {
    name: string;
    email: string;
    password: string | null;
  }): Promise<User> {
    const user = this.usersRepository.create(data as Partial<User>);
    // the Partial<User> is a workaround, as first it need roles but oauth does not have role yet when signing up
    // so cast it as that, with default value of []
    return this.usersRepository.save(user);
  }

  async assignRole(userId: number, roleName: string) {
    const exists = await this.userRoleRepository.findOne({
      where: {
        user: { id: userId },
        role: { name: roleName },
      },
    });

    if (exists) return exists;

    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    const role = await this.roleRepository.findOne({
      where: { name: roleName },
      lock: {
        mode: 'pessimistic_write', // you're the only one who can write at this time
      },
    });

    if (!role) throw new NotFoundException('Role not found');

    const userRole = this.userRoleRepository.create({
      user,
      role,
    });

    return this.userRoleRepository.save(userRole);
  }

  async setRole(userId: number, roleName: string) {
    await this.userRoleRepository.delete({ user: { id: userId } });
    return this.assignRole(userId, roleName);
  }

  async deleteUser(id: number) {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('User not found');
  }
}
