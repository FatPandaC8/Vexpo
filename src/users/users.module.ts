import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';
import { UserRole } from './userrole.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, UserRole])],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
  controllers: [UsersController],
})
export class UsersModule {}
