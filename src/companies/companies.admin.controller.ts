import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { UpdateCompanyDto } from './dto/update-company.dto';

@ApiTags('Admin - Companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/companies')
export class CompaniesAdminController {
  constructor(private companiesService: CompaniesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all companies' })
  async getAllCompanies(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20
  ) {
    return this.companiesService.findAllPaginated(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID' })
  async getCompany(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update company' })
  async updateCompany(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCompanyDto
  ) {
    return this.companiesService.updateCompany(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete company' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCompany(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.deleteCompany(id);
  }
}