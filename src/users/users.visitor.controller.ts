import { Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('VISITOR')
@Controller()
export class UserVisitorController {
    constructor (private userService: UsersService) {}

    @Post(':id')
    register(@Param('expoId') expoId: number, @Req() req) {
        return this.userService.register(expoId, req.user.userId);
    }
}