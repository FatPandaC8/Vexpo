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
    return this.usersRepository.findOne(
      {
        where: {email},
        relations: ['roles', 'roles.role'],
      }
    );
  }

  async findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.role'],
    });
  }

  async findAll() {
    return this.usersRepository.find({relations: ['roles']});
  }

  async createUserOnly(data: {
    name: string;
    email: string;
    password: string | null;
  }): Promise<User | User[]> {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  async assignRole(userId: number, roleName: string) {
    const user = await this.usersRepository.findOneBy({id: userId});
    if (!user) throw new NotFoundException('User not found');

    const role = await this.roleRepository.findOne({
      where: {name: roleName},
    });

    if (!role) throw new NotFoundException('Role not found');

    const userRole = this.userRoleRepository.create({
      user,
      role,
    });

    return this.userRoleRepository.save(userRole);
  }
}