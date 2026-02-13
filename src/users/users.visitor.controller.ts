import { Controller, Get, Param, ParseIntPipe, Post, Req, Request, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users - Public')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('VISITOR')
@Controller()
export class UserVisitorController {
  constructor(private userService: UsersService) {}

  @Post('expos/:expoId/registration')
  @ApiOperation({ summary: 'Register for an expo as visitor' })
  async registerForExpo(
    @Param('expoId', ParseIntPipe) expoId: number,
    @Request() req
  ) {
    return this.userService.registerForExpo(expoId, req.user.userId);
  }

  @Get('me/visited-booths')
  @ApiOperation({ summary: 'Get all booths visited by current user' })
  async getVisitedBooths(@Request() req) {
    return this.userService.getVisitedBooths(req.user.userId);
  }
}
