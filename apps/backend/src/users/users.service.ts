import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { UserRole } from 'src/entities/userrole.entity';
import { Repository } from 'typeorm';
import { PublicUserInfo } from './dto/public-user.dto';

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

  profile(userId: string) {
    return this.userRepository.findOne({
      where: {
        id: userId
      },
      select: ['name', 'email'],
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['roles', 'roles.role'], // if no relation, user will be loaded with no role
      // if only have roles, user's role attribute will be empty
      // if have roles.role, user's role attribute is loaded with roles
    });
  }

  async findOneById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.role'],
    });
  }

  async getPublicInfo(id: string) {
    // get the user
    const public_user = await this.findOneById(id);

    // for more protection: check if the found user is an admin ?
    const isAdmin = await this.userRoleRepository.findOneBy({
      id: public_user?.id,
    });
    
    // 1 is admin
    if (isAdmin?.roleId === 1) {
      throw new BadRequestException('You cannot view admin info');
    }

    // return the user info
    const return_user: PublicUserInfo = {
      name: public_user?.name,
    };

    return return_user;
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

  async assignRole(userId: string, roleName: string) {
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

  async setRole(userId: string, roleName: string) {
    await this.userRoleRepository.delete({ user: { id: userId } });
    return this.assignRole(userId, roleName);
  }

  async updateUser(
    id: string,
    data: {
      name?: string;
      email?: string;
      role?: string;
    },
  ) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.role'],
    });

    if (!user) throw new NotFoundException('User not found');

    // update basic fields
    if (data.name !== undefined) {
      user.name = data.name;
    }

    if (data.email !== undefined) {
      user.email = data.email;
    }

    await this.userRepository.save(user);

    // update role if provided
    if (data.role) {
      await this.setRole(id, data.role);
    }

    return this.findOneById(id);
  }

  async deleteUser(id: number) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('User not found');
  }

  async findAllPaginated(page: number = 1, limit: number = 20) {
    // TODO: not optimized if the the number are large Bach :(
    const [items, total] = await this.userRepository.findAndCount({
      relations: ['roles', 'roles.role'],
      select: ['id', 'name', 'email'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
