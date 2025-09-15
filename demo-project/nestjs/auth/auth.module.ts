import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { Auth0JwtStrategy } from './auth0-jwt.strategy';
import { Auth0Service } from './auth0.service';
import { RolesGuard } from './roles.guard';
import { TokenService } from './token.service';
import { TokensController } from './tokens.controller';
import { AdminController } from './admin.controller';
import { Auth0Controller } from './auth0.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwt.secret'),
        signOptions: { 
          expiresIn: configService.get<string>('auth.jwt.expiresIn'),
          issuer: configService.get<string>('auth.jwt.issuer'),
          audience: configService.get<string>('auth.jwt.audience'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [TokensController, AdminController, Auth0Controller],
  providers: [JwtStrategy, Auth0JwtStrategy, Auth0Service, RolesGuard, TokenService],
  exports: [RolesGuard, JwtModule, Auth0Service],
})
export class AuthModule {}