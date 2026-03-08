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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Public } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { BoothsService } from './booths.service';
import { UpdateBoothDTO } from './dto/update-booth.dto';
import type { AuthRequest } from 'src/auth/interfaces/auth-request.interface';
import { Booth } from 'src/entities/booth.entity';

@ApiTags('Booths')
@Controller('booths')
export class BoothsController {
  constructor(private boothsService: BoothsService) {}

  // Public

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all booths' })
  findAll(
  ): Promise<Booth[]> {
    return this.boothsService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get booth by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Booth> {
    return this.boothsService.getBoothById(id);
  }

  // Authenticated - exhibitor owns, organizer/admin bypass

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('exhibitor', 'organizer')
  @Patch(':id')
  @ApiOperation({ summary: 'Update booth' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBoothDTO,
    @Req() req: AuthRequest,
  ): Promise<Booth> {
    const { role, userId } = req.user;

    if (role === 'admin' || role === 'organizer') {
      return this.boothsService.updateBooth(id, dto);
    }

    // Exhibitor: strip status - cannot self-approve
    const { status: _status, ...exhibitorDto } = dto;
    return this.boothsService.updateBoothByExhibitor(id, userId, exhibitorDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('exhibitor', 'organizer')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete booth' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthRequest,
  ): Promise<{ message: string } | void> {
    const role: string = req.user.role as string;
    const userId: string = req.user.userId;

    if (role === 'admin' || role === 'organizer') {
      return this.boothsService.deleteBooth(id);
    }
    return this.boothsService.deleteBoothByExhibitor(id, userId);
  }
}
