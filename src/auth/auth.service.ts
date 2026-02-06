import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
// passport-jwt is for securing RESTful endpoints with JWT

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDTO) { // register : assigning role instead of register with role
    // people can register as a company or as a visitor
    // the organizer can be assigned
    const {name, email, password, role} = dto;

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
    const payload = {
      sub: user.id,
      email: user.email,
      role
    }

    console.log("Register payload: ", payload);

    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  }

  async login(
    dto: LoginDTO,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user) throw new NotFoundException("User not found");
    const isMatchPassword = await bcrypt.compare(dto.password, user.password);
    if (!isMatchPassword) {
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

  async logout() {
    // for now, the jwt token is deleted only by client => which is not secure
    // for future, need to add db for token, actual delete token from the db
    // for ref: https://viblo.asia/p/logout-voi-jwt-gAm5yyak5db
    console.log("LOG OUT");
  }
}
