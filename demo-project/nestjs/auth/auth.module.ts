import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { TokenService } from './token.service';
import { TokensController } from './tokens.controller';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'demo-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [TokensController, AdminController],
  providers: [JwtStrategy, RolesGuard, TokenService],
  exports: [RolesGuard, JwtModule],
})
export class AuthModule {}