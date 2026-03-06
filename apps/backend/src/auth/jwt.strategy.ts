import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload, JwtUser } from '@vexpo/schema';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // Recap: Strategy in this context is strategy pattern -- lets you define a family of algorithms
  // put each into a separate class, and make their objects interchangable
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // auto send 401 if token has expired
      secretOrKey: process.env.JWT_SECRET as string,
    });
  }
  validate(payload: JwtPayload): JwtUser {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role ?? null,
    };
  }
}
