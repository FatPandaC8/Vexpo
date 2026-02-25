import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard, Public } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { ExposService } from './expos.service';
import { CreateExpoDTO } from './dto/create-expo.dto';
import { UpdateExpoDTO } from './dto/update-expo.dto';

@ApiTags('Expos')
@Controller('expos')
export class ExposController {
  constructor(private expoService: ExposService) {}

  // Public

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all expos' })
  @ApiQuery({ name: 'type', required: false })
  findAll(@Query('type') type?: string) {
    return this.expoService.findAll({ type });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get expo by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.expoService.findExpoById(id);
  }

  @Public()
  @Get(':id/booths')
  @ApiOperation({ summary: 'Get approved booths of an expo' })
  findBooths(@Param('id', ParseIntPipe) id: number) {
    return this.expoService.findAllBoothsByExpoId(id);
  }

  // Organizer / Admin

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer')
  @Post()
  @ApiOperation({ summary: 'Create expo (organizer)' })
  create(@Body() dto: CreateExpoDTO, @Req() req: any) {
    return this.expoService.createExpo(req.user.userId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer')
  @Patch(':id')
  @ApiOperation({
    summary: 'Update expo organizer must own it, admin bypasses',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExpoDTO,
    @Req() req: any,
  ) {
    const roles: string[] = req.user.roles.map((r: string) => r.toLowerCase());
    if (roles.includes('admin')) return this.expoService.updateExpo(id, dto);
    return this.expoService.updateExpoByOrganizer(id, req.user.userId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete expo organizer must own it, admin bypasses',
  })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const roles: string[] = req.user.roles.map((r: string) => r.toLowerCase());
    if (roles.includes('admin')) return this.expoService.deleteExpo(id);
    return this.expoService.deleteExpoByOrganizer(id, req.user.userId);
  }

  // Organizer booth management within their expo

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer')
  @Get(':id/booths/all')
  @ApiOperation({
    summary:
      'Get ALL booths of expo (organizer/admin - not filtered by status)',
  })
  async findAllBoothsManage(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    const roles: string[] = req.user.roles.map((r: string) => r.toLowerCase());
    if (roles.includes('admin'))
      return this.expoService.findAllBoothsByExpoId(id);
    return this.expoService.getExpoBoothsByOrganizer(id, req.user.userId);
  }
}
