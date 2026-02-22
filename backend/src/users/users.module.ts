import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { UserRole } from 'src/entities/userrole.entity';
import { UserAdminController } from './users.admin.controller';
import { UsersProfileController } from './users.profile.controller';
import { BoothsModule } from 'src/booths/booths.module';
import { ExposModule } from 'src/expos/expos.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { Company } from 'src/entities/company.entity';
import { UsersMeController } from './users.me.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, UserRole, Company]),
    BoothsModule,
    ExposModule,
    CompaniesModule,
  ],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
  controllers: [
    UsersController,
    UserAdminController,
    UsersProfileController,
    UsersMeController
  ],
})
export class UsersModule {}
