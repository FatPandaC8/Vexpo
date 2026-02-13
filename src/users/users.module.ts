import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { UserRole } from 'src/entities/userrole.entity';
import { UserAdminController } from './users.admin.controller';
import { UsersProfileController } from './users.profile.controller';
import { UserVisitorController } from './users.visitor.controller';
import { Registration } from 'src/entities/registration.entity';
import { BoothsModule } from 'src/booths/booths.module';
import { ExposModule } from 'src/expos/expos.module';
import { UserExhibitorController } from './users.exhibitor.controller';
import { UserOrganizerController } from './users.organizer.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, UserRole, Registration]),
    BoothsModule,
    ExposModule,
  ],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
  controllers: [
    UsersController,
    UserAdminController,
    UsersProfileController,
    UserVisitorController,
    UserExhibitorController,
    UserOrganizerController,
  ],
})
export class UsersModule {}
