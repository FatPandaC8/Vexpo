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
    const user = await this.usersService.findOneByEmail(email);
    if (user?.password !== password) {
      throw new UnauthorizedException('Invalud credentials');
    }

    const payload = { 
      sub: user.id,
      roles: user.roles.map(ur => ur.role.name.toUpperCase()),
    };

    console.log("Payload: " + payload.roles + " - " + payload.sub);

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async logout() {}
}
