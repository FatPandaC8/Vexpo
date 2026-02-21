import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExposService } from 'src/expos/expos.service';
import { BoothsService } from 'src/booths/booths.service';
import { CreateExpoDTO } from 'src/expos/dto/create-expo.dto';
import { UpdateExpoDTO } from 'src/expos/dto/update-expo.dto';
import { UpdateBoothStatusDTO } from 'src/booths/dto/update-booth-status.dto';

@ApiTags('Organizer')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ORGANIZER')
@Controller()
export class UserOrganizerController {
  constructor(
    private exposService: ExposService,
    private boothsService: BoothsService,
  ) {}

  @Get('me/expos')
  @ApiOperation({ summary: 'Get all expos of current organizer' })
  async getMyExpos(@Request() req) {
    return this.exposService.getExposByOrganizer(req.user.userId);
  }

  @Post('expos')
  @ApiOperation({ summary: 'Create a new expo' })
  async createExpo(@Request() req, @Body() dto: CreateExpoDTO) {
    return this.exposService.createExpo(req.user.userId, dto);
  }

  @Patch('expos/:expoId')
  @ApiOperation({ summary: 'Update expo information' })
  async updateExpo(
    @Param('expoId', ParseIntPipe) expoId: number,
    @Body() dto: UpdateExpoDTO,
    @Request() req,
  ) {
    return this.exposService.updateExpoByOrganizer(
      expoId,
      req.user.userId,
      dto,
    );
  }

  @Delete('expos/:expoId')
  @ApiOperation({ summary: 'Delete expo' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteExpo(
    @Param('expoId', ParseIntPipe) expoId: number,
    @Request() req,
  ) {
    return this.exposService.deleteExpoByOrganizer(expoId, req.user.userId);
  }

  @Get('expos/:expoId/booths')
  @ApiOperation({ summary: 'Get all booths of an expo' })
  async getExpoBooths(
    @Param('expoId', ParseIntPipe) expoId: number,
    @Request() req,
  ) {
    return this.exposService.getExpoBoothsByOrganizer(expoId, req.user.userId);
  }

  @Patch('booths/:boothId/status')
  @ApiOperation({ summary: 'Approve or reject booth' })
  async updateBoothStatus(
    @Param('boothId', ParseIntPipe) boothId: number,
    @Body() dto: UpdateBoothStatusDTO,
    @Request() req,
  ) {
    return this.boothsService.updateBoothStatus(
      boothId,
      req.user.userId,
      dto.status,
    );
  }
}
