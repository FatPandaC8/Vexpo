import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { CompaniesAdminController } from './companies.admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  controllers: [CompaniesController, CompaniesAdminController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
