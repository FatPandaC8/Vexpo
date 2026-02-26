import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { BoothsService } from 'src/booths/booths.service';
import { CreateBoothContentDTO } from 'src/booths/dto/create-booth-content.dto';
import { CompaniesService } from 'src/companies/companies.service';
import { RegisterCompanyDTO } from 'src/companies/dto/create-company.dto';
import { UpdateCompanyDto } from 'src/companies/dto/update-company.dto';
import { ExposService } from 'src/expos/expos.service';
import { UsersService } from './users.service';

@ApiTags('Me')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class UsersMeController {
  constructor(
    private usersService: UsersService,
    private boothsService: BoothsService,
    private exposService: ExposService,
    private companiesService: CompaniesService,
  ) {}

  // ── Profile (any authenticated user) ─────────────────────────────────────

  @Get('me')
  @ApiOperation({ summary: 'Get own profile' })
  async getProfile(@Req() req: any) {
    const user = await this.usersService.findOneById(req.user.userId);
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles?.map((ur) => ur.role.name) ?? [],
    };
  }

  // ── Booths (exhibitor+) ───────────────────────────────────────────────────

  @Roles('exhibitor')
  @Get('me/booths')
  @ApiOperation({ summary: 'Get my booths' })
  getMyBooths(@Req() req: any) {
    return this.boothsService.getBoothsByExhibitor(req.user.userId);
  }

  // ── Company (exhibitor+) ──────────────────────────────────────────────────

  @Roles('exhibitor')
  @Get('me/company')
  @ApiOperation({ summary: 'Get my company' })
  getMyCompany(@Req() req: any) {
    return this.companiesService.getCompanyByExhibitor(req.user.userId);
  }

  @Roles('exhibitor')
  @Patch('companies/:id')
  @ApiOperation({ summary: 'Update own company' })
  updateCompany(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.companiesService.updateCompany(id, dto);
  }

  // ── Expos (organizer+) ────────────────────────────────────────────────────

  @Roles('organizer')
  @Get('me/expos')
  @ApiOperation({ summary: 'Get my expos' })
  getMyExpos(@Req() req: any) {
    return this.exposService.getExposByOrganizer(req.user.userId);
  }
}
