import { Controller, Get, UseGuards } from "@nestjs/common";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/users')
export class UserAdminController {
    constructor (private userService: UsersService) {}
    @Get()
    findAll() {
        return this.userService.findAll();
    }
}