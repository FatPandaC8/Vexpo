import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { PublicUserInfo } from './dto/public-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findAll() {
    return this.userRepository.find({
      relations: ['role'],
      order: { id: 'DESC' },
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  async findOneById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });
  }

  async getPublicInfo(userId: string) {
    const user = await this.findOneById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (user.role?.name === 'admin') {
      throw new BadRequestException('You cannot view admin info');
    }

    const returnUser: PublicUserInfo = { name: user.name };
    return returnUser;
  }

  async createUserOnly(data: {
    name: string;
    email: string;
    password: string | null;
  }): Promise<User> {
    const user = this.userRepository.create(data as Partial<User>);
    // the Partial<User> is a workaround, as first it need roles but oauth does not have role yet when signing up
    // so cast it as that, with default value of null
    return this.userRepository.save(user);
  }

  async assignRole(userId: string, roleName: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role'],
    });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    const role = await this.roleRepository.findOne({
      where: { name: roleName },
    });
    if (!role) {
      throw new BadRequestException('Invalid role');
    }

    // Point user to the shared role row (works for both new users and role changes)
    user.role = role;
    await this.userRepository.save(user);

    return (await this.findOneById(userId)) as User;
  }

  async updateUser(
    id: string,
    data: { name?: string; email?: string; role?: string },
  ) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) throw new NotFoundException('User not found');

    if (data.name !== undefined) user.name = data.name;
    if (data.email !== undefined) user.email = data.email;
    await this.userRepository.save(user);

    if (data.role) {
      await this.assignRole(id, data.role);
    }

    return this.findOneById(id);
  }

  async deleteUser(id: string) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('User not found');
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    const result = await this.userRepository.update(userId, {
      password: hashedPassword,
    });

    if (result.affected === 0) throw new NotFoundException('User not found in the repository');
  }
}
