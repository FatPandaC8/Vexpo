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
import { CreateBoothContentDTO } from 'src/booths/dto/create-booth-content.dto';
import { BoothsService } from 'src/booths/booths.service';
import { Expo } from 'src/entities/expo.entity';
import { Booth } from 'src/entities/booth.entity';
import type { AuthRequest } from 'src/auth/interfaces/auth-request.interface';

@ApiTags('Expos')
@Controller('expos')
export class ExposController {
  constructor(
    private expoService: ExposService,
    private boothsService: BoothsService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all expos' })
  @ApiQuery({ name: 'type', required: false })
  findAll(@Query('type') type?: string): Promise<Expo[]> {
    return this.expoService.findAll({ type });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get expo by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Expo> {
    return this.expoService.findExpoById(id);
  }

  @Public()
  @Get(':id/booths')
  @ApiOperation({ summary: 'Get approved booths of an expo' })
  findBooths(@Param('id', ParseUUIDPipe) id: string): Promise<Booth[]> {
    return this.expoService.findAllBoothsByExpoId(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer')
  @Post()
  @ApiOperation({ summary: 'Create expo (organizer)' })
  create(@Body() dto: CreateExpoDTO, @Req() req: AuthRequest): Promise<Expo> {
    return this.expoService.createExpo(req.user.userId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer')
  @Patch(':id')
  @ApiOperation({ summary: 'Update expo (organizer must own it, admin bypasses)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateExpoDTO,
    @Req() req: AuthRequest,
  ): Promise<Expo> {
    if (req.user.role === 'admin') return this.expoService.updateExpo(id, dto);
    return this.expoService.updateExpoByOrganizer(id, req.user.userId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete expo (organizer must own it, admin bypasses)' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthRequest,
  ): Promise<{ message: string } | void> {
    if (req.user.role === 'admin') return this.expoService.deleteExpo(id);
    return this.expoService.deleteExpoByOrganizer(id, req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer')
  @Get(':id/booths/all')
  @ApiOperation({ summary: 'Get ALL booths of expo (organizer/admin)' })
  async findAllBoothsManage(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthRequest,
  ): Promise<Booth[]> {
    if (req.user.role === 'admin')
      return this.expoService.findAllBoothsByExpoId(id);
    return this.expoService.getExpoBoothsByOrganizer(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('exhibitor')
  @Post(':expoId/booths')
  @ApiOperation({ summary: 'Register a booth for an expo' })
  createBooth(
    @Param('expoId', ParseUUIDPipe) expoId: string,
    @Body() dto: CreateBoothContentDTO,
    @Req() req: AuthRequest,
  ): Promise<Booth> {
    return this.boothsService.createBooth(expoId, req.user.userId, dto);
  }
}