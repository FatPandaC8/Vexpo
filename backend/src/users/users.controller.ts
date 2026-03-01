import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Public } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  // Should make a public API for specific user profile fetching:
  // People should be able to get organizer & exhibitor name & email by DTO
  @Public()
  @ApiOperation({
    description: 'Get the organizer/exhibitor info based on their id.',
  })
  @ApiOkResponse({
    description: 'The specific orgnizer/exhibitor name & email.',
  })
  @Get(':id')
  findOrganizerById(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.getPublicInfo(userId);
  }

  @Roles('admin')
  @ApiOperation({ description: 'Get all the users.' })
  @ApiOkResponse({ description: 'A list of users' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.userService.findAllPaginated(page, limit);
  }

  @Roles('admin')
  @ApiOperation({ description: 'Get the user based on their id.' })
  @ApiOkResponse({ description: 'The specific user' })
  @Get(':id')
  findUserIdAdmin(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.findOneById(userId);
  }

  @Roles('admin')
  @ApiOperation({ description: 'Edit user' })
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: UpdateUserDTO,
  ) {
    return this.userService.updateUser(userId, dto);
  }

  @Roles('admin')
  @ApiOperation({ description: 'Delete the user.' })
  @ApiBadRequestResponse({ description: 'Admins cannot delete themselves' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.deleteUser(userId);
  }
}
