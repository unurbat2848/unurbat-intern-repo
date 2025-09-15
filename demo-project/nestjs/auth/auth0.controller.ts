import { Controller, Get, Query, UseGuards, Request, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Auth0Service } from './auth0.service';

@Controller('auth0')
export class Auth0Controller {
  constructor(private readonly auth0Service: Auth0Service) {}

  /**
   * Generate Auth0 login URL for frontend applications
   * GET /auth0/login?redirectUri=http://localhost:3000/callback&state=optional
   */
  @Get('login')
  getLoginUrl(
    @Query('redirectUri') redirectUri: string,
    @Query('state') state?: string,
  ) {
    if (!redirectUri) {
      throw new Error('redirectUri is required');
    }

    return this.auth0Service.getLoginUrl(redirectUri, state);
  }

  /**
   * Generate Auth0 logout URL
   * GET /auth0/logout?returnTo=http://localhost:3000
   */
  @Get('logout')
  getLogoutUrl(@Query('returnTo') returnTo?: string) {
    return this.auth0Service.getLogoutUrl(returnTo);
  }

  /**
   * Exchange authorization code for tokens
   * POST /auth0/token
   * Body: { code: "auth_code", redirectUri: "http://localhost:3000/callback" }
   */
  @Post('token')
  async exchangeCodeForTokens(
    @Body() body: { code: string; redirectUri: string },
  ) {
    const { code, redirectUri } = body;

    if (!code || !redirectUri) {
      throw new Error('code and redirectUri are required');
    }

    return this.auth0Service.exchangeCodeForTokens(code, redirectUri);
  }

  /**
   * Get user info using access token
   * POST /auth0/userinfo
   * Body: { accessToken: "access_token" }
   */
  @Post('userinfo')
  async getUserInfo(@Body() body: { accessToken: string }) {
    const { accessToken } = body;

    if (!accessToken) {
      throw new Error('accessToken is required');
    }

    return this.auth0Service.getUserInfo(accessToken);
  }

  /**
   * Protected route that requires Auth0 JWT
   * GET /auth0/profile
   * Headers: Authorization: Bearer <jwt_token>
   */
  @Get('profile')
  @UseGuards(AuthGuard('auth0-jwt'))
  getProfile(@Request() req) {
    return {
      message: 'This is a protected route using Auth0 JWT',
      user: req.user,
    };
  }

  /**
   * Protected route using the default JWT strategy
   * GET /auth0/profile-default
   * Headers: Authorization: Bearer <jwt_token>
   */
  @Get('profile-default')
  @UseGuards(AuthGuard('jwt'))
  getProfileDefault(@Request() req) {
    return {
      message: 'This is a protected route using default JWT strategy',
      user: req.user,
    };
  }
}