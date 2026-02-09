import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { UserRole } from 'src/entities/userrole.entity';
import { UserAdminController } from './users.admin.controller';
import { UsersProfileController } from './users.profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, UserRole])],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
  controllers: [UsersController, UserAdminController, UsersProfileController],
})
export class UsersModule {}
