import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Public } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor (private userService: UsersService) {}

    // Should make a public API for specific user profile fetching:
    // People should be able to get organizer & exhibitor name & email by DTO
    @Public()
    @ApiOperation({ description: 'Get the organizer/exhibitor info based on their id.' })
    @ApiOkResponse({ description: 'The specific orgnizer/exhibitor name & email.' })
    @Get(':id')
    findUserId(@Param('id', ParseIntPipe) userId: number) {
        return this.userService.getPublicInfo(userId);
    }
}
