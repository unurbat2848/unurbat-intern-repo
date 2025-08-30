import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { TokenService } from './token.service';
import { TokensController } from './tokens.controller';
import { AdminController } from './admin.controller';

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
  controllers: [TokensController, AdminController],
  providers: [JwtStrategy, RolesGuard, TokenService],
  exports: [RolesGuard, JwtModule],
})
export class AuthModule {}