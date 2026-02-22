import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    const requiredRoles = this.reflector.getAllAndMerge<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRoles?.length) return true

    const request = context.switchToHttp().getRequest()
    const user = request.user
    if (!user?.roles) return false

    const userRoles = (user.roles as string[]).map((r) => r.toLowerCase())

    if (userRoles.includes('admin')) return true

    return requiredRoles.some((r) => userRoles.includes(r.toLowerCase()))
  }
}