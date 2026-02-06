import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne(
      {
        where: {email},
        relations: ['roles', 'roles.role'],
      }
    );
  }

  async findAll() {
    return this.usersRepository.find({relations: ['roles']});
  }
}