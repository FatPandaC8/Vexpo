import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Public } from 'src/auth/jwt-auth.guard';
import { ApiOperation } from '@nestjs/swagger';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Roles } from 'src/auth/roles.decorator';
import { RegisterCompanyDTO } from './dto/create-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private companyService: CompaniesService) {}

  @Public()
  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.companyService.findAllPaginated(page, limit);
  }

  @Public()
  @Get(':id')
  findCompanyById(@Param('id', ParseUUIDPipe) id: string) {
    return this.companyService.findById(id);
  }

  @Roles('admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Update company' })
  async updateCompany(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.companyService.updateCompany(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete company' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCompany(@Param('id', ParseUUIDPipe) id: string) {
    return this.companyService.deleteCompany(id);
  }

  @Roles('exhibitor')
  @Post()
  @ApiOperation({ summary: 'Register a company' })
  registerCompany(@Body() dto: RegisterCompanyDTO, @Req() req: any) {
    return this.companyService.registerCompany(req.user.userId, dto);
  }
}
