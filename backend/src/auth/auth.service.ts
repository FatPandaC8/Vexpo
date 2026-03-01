import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDTO) {
    const { name, email, password, role } = dto;

    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.usersService.createUserOnly({
      name,
      email,
      password: hashed,
    });

    await this.usersService.assignRole(user.id, role);

    const fullUser = await this.usersService.findOneById(user.id);

    const payload = {
      sub: fullUser!.id,
      email: fullUser!.email,
      roles: fullUser!.roles.map((ur) => ur.role.name),
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async login(dto: LoginDTO): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user) throw new NotFoundException('User not found');

    const isMatchPassword = await bcrypt.compare(
      dto.password,
      user.password as string,
    );
    if (!isMatchPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles.map((ur) => ur.role.name), // e.g. ['organizer']
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async logout() {
    console.log('LOG OUT');
  }

  async oauthLogin(oauthUser: {
    email: string;
    name: string;
    picture?: string;
  }): Promise<{ access_token: string; is_new_user: boolean }> {
    const user = await this.usersService.findOneByEmail(oauthUser.email);
    if (user) {
      const payload = {
        sub: user.id,
        email: user.email,
        roles: user.roles.map((ur) => ur.role.name), // lowercase
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
        is_new_user: false,
      };
    } else {
      const newUser = await this.usersService.createUserOnly({
        name: oauthUser.name,
        email: oauthUser.email,
        password: null,
      });

      const tempPayload = {
        sub: newUser.id,
        email: newUser.email,
        temp: true,
      };

      return {
        access_token: await this.jwtService.signAsync(tempPayload, {
          expiresIn: '10m',
        }),
        is_new_user: true,
      };
    }
  }

  async completeOAuthRegistration(
    userId: string,
    role: 'exhibitor' | 'organizer',
  ): Promise<{ access_token: string }> {
    await this.usersService.assignRole(userId, role);

    const user = await this.usersService.findOneById(userId);
    if (!user) throw new NotFoundException('User not found');

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles.map((ur) => ur.role.name), // lowercase
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
