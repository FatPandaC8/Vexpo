import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
// passport-jwt is for securing RESTful endpoints with JWT

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register() {}

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(email);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async logout() {}
}
