import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard, Public } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Roles } from 'src/auth/roles.decorator';
import { RegisterCompanyDTO } from './dto/create-company.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { PaginatedResponse } from '@vexpo/schema';
import { Company } from 'src/entities/company.entity';
import type { AuthRequest } from 'src/auth/interfaces/auth-request.interface';

@Controller('companies')
export class CompaniesController {
  constructor(private companyService: CompaniesService) {}

  @Public()
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<PaginatedResponse<Company>> {
    return this.companyService.findAllPaginated(page, limit);
  }

  @Public()
  @Get(':id')
  findCompanyById(@Param('id', ParseUUIDPipe) id: string): Promise<Company> {
    return this.companyService.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Update company' })
  async updateCompany(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCompanyDto,
  ): Promise<Company> {
    return this.companyService.updateCompany(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete company' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCompany(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    return this.companyService.deleteCompany(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('exhibitor')
  @Post()
  @ApiOperation({ summary: 'Register a company' })
  registerCompany(
    @Body() dto: RegisterCompanyDTO,
    @Request() req: AuthRequest,
  ): Promise<Company> {    
    return this.companyService.registerCompany(req.user.userId, dto);
  }
}
