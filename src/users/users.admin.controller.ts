import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/users')
export class UserAdminController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ description: 'Get all the users.' })
  @ApiOkResponse({ description: 'A list of users' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ description: 'Get the user based on their id.' })
  @ApiOkResponse({ description: 'The specific user' })
  @Get(':id')
  findUserId(@Param('id') userId: number) {
    return this.userService.findOneById(userId);
  }

  @ApiOperation({ description: "Edit the user's role." })
  @Patch(':id')
  editUserRole(@Param('id') userId: number, @Param('role') newRole: string) {
    return this.userService.setRole(userId, newRole);
  }

  @ApiOperation({ description: 'Delete the user.' })
  @ApiBadRequestResponse({ description: 'Admins cannot delete themselves' })
  @Delete(':id')
  deleteUser(@Param('id') userId: number, @Req() req) {
    if (req.user.id === userId) {
      throw new BadRequestException('Admins cannot delete themselves');
    }
    return this.userService.deleteUser(userId);
  }
}
