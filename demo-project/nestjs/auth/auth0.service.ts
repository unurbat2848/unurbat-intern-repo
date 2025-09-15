import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface Auth0LoginUrl {
  url: string;
}

export interface Auth0User {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  email_verified: boolean;
}

@Injectable()
export class Auth0Service {
  private readonly auth0Domain: string;
  private readonly clientId: string;
  private readonly audience: string;
  private readonly scope: string;

  constructor(private configService: ConfigService) {
    this.auth0Domain = configService.get<string>('auth.auth0.domain');
    this.clientId = configService.get<string>('auth.auth0.clientId');
    this.audience = configService.get<string>('auth.auth0.audience');
    this.scope = configService.get<string>('auth.auth0.scope') || 'openid profile email';

    if (!this.auth0Domain || !this.clientId) {
      throw new Error('Auth0 domain and client ID are required');
    }
  }

  /**
   * Generate Auth0 login URL for frontend applications
   * This URL redirects users to Auth0's hosted login page
   */
  getLoginUrl(redirectUri: string, state?: string): Auth0LoginUrl {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: redirectUri,
      scope: this.scope,
      ...(this.audience && { audience: this.audience }),
      ...(state && { state }),
    });

    const url = `https://${this.auth0Domain}/authorize?${params.toString()}`;

    return { url };
  }

  /**
   * Get Auth0 logout URL
   * This logs the user out from Auth0 and optionally redirects to a return URL
   */
  getLogoutUrl(returnTo?: string): Auth0LoginUrl {
    const params = new URLSearchParams({
      client_id: this.clientId,
      ...(returnTo && { returnTo }),
    });

    const url = `https://${this.auth0Domain}/v2/logout?${params.toString()}`;

    return { url };
  }

  /**
   * Exchange authorization code for tokens
   * This is typically done by your frontend application
   */
  async exchangeCodeForTokens(code: string, redirectUri: string) {
    const response = await fetch(`https://${this.auth0Domain}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: this.clientId,
        client_secret: this.configService.get<string>('auth.auth0.clientSecret'),
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error(`Auth0 token exchange failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get user information from Auth0
   * Requires a valid access token
   */
  async getUserInfo(accessToken: string): Promise<Auth0User> {
    const response = await fetch(`https://${this.auth0Domain}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Auth0 userinfo request failed: ${response.statusText}`);
    }

    return response.json();
  }
}