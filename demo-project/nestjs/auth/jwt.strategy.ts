import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from './roles.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  roles?: string[];
  permissions?: string[];
  'https://api.focusbear.app/roles'?: string[];
  'https://api.focusbear.app/permissions'?: string[];
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  roles: Role[];
  permissions: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwt.secret') || 'fallback-secret',
      // In production, you would use Auth0's JWKS endpoint:
      // secretOrKeyProvider: passportJwtSecret({
      //   cache: true,
      //   rateLimit: true,
      //   jwksRequestsPerMinute: 5,
      //   jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
      // }),
      // audience: process.env.AUTH0_AUDIENCE,
      // issuer: `https://${process.env.AUTH0_DOMAIN}/`,
      // algorithms: ['RS256'],
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    // Extract roles from Auth0 custom claims
    // Auth0 adds roles and permissions as custom claims with your domain namespace
    const roles = payload['https://api.focusbear.app/roles'] || 
                 payload.roles || 
                 [];
    
    const permissions = payload['https://api.focusbear.app/permissions'] || 
                       payload.permissions || 
                       [];

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      roles: roles.map(role => role as Role),
      permissions: permissions,
    };
  }
}