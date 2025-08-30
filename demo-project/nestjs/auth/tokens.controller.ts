import { Controller, Get, Param } from '@nestjs/common';
import { TokenService } from './token.service';

@Controller('auth/tokens')
export class TokensController {
  constructor(private tokenService: TokenService) {}

  @Get('demo')
  getDemoTokens() {
    const tokens = this.tokenService.getDemoTokens();
    
    return {
      message: 'Demo JWT tokens for testing RBAC endpoints',
      instructions: {
        usage: 'Copy a token and add it to Authorization header: Bearer <token>',
        endpoints: {
          admin: 'Use admin token to access all protected endpoints',
          moderator: 'Use moderator token to access dashboard and user read operations',
          user: 'Use user token to access only profile endpoint',
        }
      },
      tokens: {
        admin: tokens.admin,
        moderator: tokens.moderator,
        user: tokens.user,
      },
      testEndpoints: [
        'GET /api/admin/dashboard - Requires admin or moderator role',
        'GET /api/admin/users - Requires users:read permission',
        'POST /api/admin/users - Requires users:create permission',
        'GET /api/admin/system-settings - Requires admin role only',
        'GET /api/admin/reports - Requires reports:read AND analytics:read permissions',
        'GET /api/admin/profile - Requires only authentication',
      ]
    };
  }

  @Get('demo/:userType')
  getDemoToken(@Param('userType') userType: 'admin' | 'moderator' | 'user') {
    if (!['admin', 'moderator', 'user'].includes(userType)) {
      return { error: 'Invalid user type. Use admin, moderator, or user' };
    }

    return {
      userType,
      token: this.tokenService.generateDemoToken(userType),
      usage: 'Add to Authorization header: Bearer <token>',
    };
  }
}