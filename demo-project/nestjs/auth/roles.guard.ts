import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, PERMISSIONS_KEY } from './roles.decorator';
import { Role } from './roles.enum';
import { AuthenticatedUser } from './jwt.strategy';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: AuthenticatedUser = request.user;

    if (!user) {
      return false;
    }

    // Check if user has required roles
    const hasRole = !requiredRoles || 
      requiredRoles.some((role) => user.roles?.includes(role));

    // Check if user has required permissions
    const hasPermission = !requiredPermissions || 
      this.checkPermissions(user.permissions || [], requiredPermissions);

    // Admin role has access to everything
    const isAdmin = user.roles?.includes(Role.ADMIN);

    return isAdmin || (hasRole && hasPermission);
  }

  private checkPermissions(
    userPermissions: string[], 
    requiredPermissions: string[]
  ): boolean {
    return requiredPermissions.every(permission => {
      // Check for exact permission match
      if (userPermissions.includes(permission)) {
        return true;
      }

      // Check for wildcard permissions (e.g., "users:*" allows "users:create", "users:read", etc.)
      const [resource] = permission.split(':');
      const wildcardPermission = `${resource}:*`;
      if (userPermissions.includes(wildcardPermission)) {
        return true;
      }

      // Check for super admin permission
      if (userPermissions.includes('*:*')) {
        return true;
      }

      return false;
    });
  }
}