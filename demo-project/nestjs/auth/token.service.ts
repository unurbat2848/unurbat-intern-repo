import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from './roles.enum';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  generateDemoToken(userType: 'admin' | 'moderator' | 'user'): string {
    let payload: JwtPayload;

    switch (userType) {
      case 'admin':
        payload = {
          sub: 'admin-123',
          email: 'admin@focusbear.app',
          name: 'Admin User',
          'https://api.focusbear.app/roles': [Role.ADMIN],
          'https://api.focusbear.app/permissions': [
            'users:read',
            'users:create',
            'users:update',
            'users:delete',
            'system:read',
            'system:write',
            'reports:read',
            'analytics:read',
          ],
        };
        break;

      case 'moderator':
        payload = {
          sub: 'moderator-456',
          email: 'moderator@focusbear.app',
          name: 'Moderator User',
          'https://api.focusbear.app/roles': [Role.MODERATOR],
          'https://api.focusbear.app/permissions': [
            'users:read',
            'users:update',
            'reports:read',
          ],
        };
        break;

      case 'user':
        payload = {
          sub: 'user-789',
          email: 'user@focusbear.app',
          name: 'Regular User',
          'https://api.focusbear.app/roles': [Role.USER],
          'https://api.focusbear.app/permissions': [],
        };
        break;
    }

    return this.jwtService.sign(payload);
  }

  getDemoTokens() {
    return {
      admin: this.generateDemoToken('admin'),
      moderator: this.generateDemoToken('moderator'),
      user: this.generateDemoToken('user'),
    };
  }
}