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
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {}

  // PUBLIC API

  profile(userId: number) {
    return this.userRepository.findOne({
      where: {
        id: userId
      },
      select: ['name', 'email']
    });
  }

  // /PUBLIC API

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['roles', 'roles.role'], // if no relation, user will be loaded with no role
      // if only have roles, user's role attribute will be empty
      // if have roles.role, user's role attribute is loaded with roles
    });
  }

  async findOneById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.role'],
    });
  }

  async findAll() {
    return this.userRepository.find({
      relations: ['roles', 'roles.role'],
      select: ['id', 'name', 'email'],
    });
  }

  async createUserOnly(data: {
    name: string;
    email: string;
    password: string | null;
  }): Promise<User> {
    const user = this.userRepository.create(data as Partial<User>);
    // the Partial<User> is a workaround, as first it need roles but oauth does not have role yet when signing up
    // so cast it as that, with default value of []
    return this.userRepository.save(user);
  }

  async assignRole(userId: number, roleName: string) {
    const exists = await this.userRoleRepository.findOne({
      where: {
        user: { id: userId },
        role: { name: roleName },
      },
    });

    if (exists) return exists;

    const role = await this.roleRepository.findOne({
      where: { name: roleName },
    });

    if (!role) throw new NotFoundException('Role not found');

    const userRole = this.userRoleRepository.create({
      userId,
      role,
    });

    return this.userRoleRepository.save(userRole);
  }

  async setRole(userId: number, roleName: string) {
    await this.userRoleRepository.delete({ user: { id: userId } });
    return this.assignRole(userId, roleName);
  }

  async deleteUser(id: number) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('User not found');
  }
}
