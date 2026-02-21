import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BoothsService } from 'src/booths/booths.service';
import { CreateBoothContentDTO } from 'src/booths/dto/create-booth-content.dto';
import { UpdateBoothDTO } from 'src/booths/dto/update-booth.dto';
import { UpdateCompanyDto } from 'src/companies/dto/update-company.dto';
import { CompaniesService } from 'src/companies/companies.service';
import { RegisterCompanyDTO } from 'src/companies/dto/create-company.dto';

@ApiTags('Exhibitor')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('EXHIBITOR')
@Controller()
export class UserExhibitorController {
  constructor(
    private boothsService: BoothsService,
    private companyService: CompaniesService,
  ) {}

  @Post('expos/:expoId/booths')
  @ApiOperation({ summary: 'Register booth for an expo' })
  async registerBooth(
    @Param('expoId', ParseIntPipe) expoId: number,
    @Body() dto: CreateBoothContentDTO,
    @Request() req,
  ) {
    return this.boothsService.createBooth(expoId, req.user.userId, dto);
  }

  @Get('me/booths')
  @ApiOperation({ summary: 'Get all booths of current exhibitor' })
  async getMyBooths(@Request() req) {
    return this.boothsService.getBoothsByExhibitor(req.user.userId);
  }

  @Get('me/company')
  @ApiOperation({ summary: 'Get the company of current exhibitor' })
  async getMyCompany(@Request() req) {
    return this.companyService.getCompanyByExhibitor(req.user.userId);
  }

  @Patch('booths/:boothId')
  @ApiOperation({ summary: 'Update booth information' })
  async updateBooth(
    @Param('boothId', ParseIntPipe) boothId: number,
    @Body() dto: UpdateBoothDTO,
    @Request() req,
  ) {
    return this.boothsService.updateBoothByExhibitor(
      boothId,
      req.user.userId,
      dto,
    );
  }

  @Post('companies')
  @ApiOperation({ summary: 'Register a company' })
  async registerCompany(@Body() dto: RegisterCompanyDTO, @Request() req) {
    return this.companyService.registerCompany(req.user.userId, dto);
  }

  @Patch('companies/:companyId')
  @ApiOperation({ summary: "Update company's details" })
  async updateCompany(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Body() dto: UpdateCompanyDto,
    @Request() req,
  ) {
    return this.companyService.updateCompany(companyId, dto);
  }
}
