import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './roles.decorator';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    const requiredRoles = this.reflector.getAllAndMerge<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;
    console.log(requiredRoles);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      console.log('RolesGuard: no user on request');
      return false;
    }
    if (!user?.roles) {
      console.log('RolesGuard: user has no roles');
      return false;
    }

    const userRoles = (user.roles as string[]).map((r) => r.toLowerCase());
    const required  = requiredRoles.map((r) => r.toLowerCase());

    if (userRoles.includes('admin')) return true

    const allowed = userRoles.some((role) => required.includes(role));
    console.log(`RolesGuard: userRoles=${JSON.stringify(userRoles)} required=${JSON.stringify(required)} allowed=${allowed}`);
    return allowed;
  }
}