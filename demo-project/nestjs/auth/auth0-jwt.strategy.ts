import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { passportJwtSecret } from 'jwks-rsa';
import { Role } from './roles.enum';

export interface Auth0JwtPayload {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  'https://api.focusbear.app/roles'?: string[];
  'https://api.focusbear.app/permissions'?: string[];
  aud: string | string[];
  iss: string;
  iat: number;
  exp: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  roles: Role[];
  permissions: string[];
}

@Injectable()
export class Auth0JwtStrategy extends PassportStrategy(Strategy, 'auth0-jwt') {
  constructor(private configService: ConfigService) {
    const auth0Domain = configService.get<string>('auth.auth0.domain');
    const auth0Audience = configService.get<string>('auth.auth0.audience');

    if (!auth0Domain) {
      throw new Error('Auth0 domain is required for Auth0JWT strategy');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,

      // Use Auth0's JWKS endpoint for token verification
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${auth0Domain}/.well-known/jwks.json`,
      }),

      // Verify the audience and issuer
      audience: auth0Audience,
      issuer: `https://${auth0Domain}/`,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: Auth0JwtPayload): Promise<AuthenticatedUser> {
    // Extract roles and permissions from Auth0 custom claims
    // Auth0 requires custom claims to be namespaced with your domain
    const roles = payload['https://api.focusbear.app/roles'] || [];
    const permissions = payload['https://api.focusbear.app/permissions'] || [];

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      roles: roles.map(role => role as Role),
      permissions: permissions,
    };
  }
}