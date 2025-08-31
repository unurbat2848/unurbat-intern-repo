import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('security')
export class SecurityController {
  
  @Get('headers')
  checkSecurityHeaders(@Req() request: Request) {
    return {
      message: 'Check the response headers for security improvements',
      headers: {
        'Content-Security-Policy': 'Set by helmet middleware',
        'X-Frame-Options': 'Set by helmet middleware',
        'X-Content-Type-Options': 'Set by helmet middleware',
        'Strict-Transport-Security': 'Set by helmet middleware',
        'X-DNS-Prefetch-Control': 'Set by helmet middleware'
      },
      requestHeaders: request.headers
    };
  }

  @Get('rate-limit-test')
  testRateLimit() {
    return {
      message: 'This endpoint is protected by rate limiting (100 requests per 15 minutes)',
      timestamp: new Date().toISOString(),
      tip: 'Try making many requests quickly to test the rate limit'
    };
  }

  @Post('validate-input')
  testInputValidation(@Body() body: any) {
    return {
      message: 'Input validation is handled by ValidationPipe globally',
      receivedData: body,
      securityFeatures: [
        'whitelist: true - strips unknown properties',
        'forbidNonWhitelisted: true - throws error for extra properties',
        'transform: true - auto-transforms to DTO instances'
      ]
    };
  }

  @Get('environment-check')
  checkEnvironmentSecurity() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return {
      message: 'Environment security check',
      environment: process.env.NODE_ENV || 'unknown',
      securityNotes: {
        development: isDevelopment ? 'CORS enabled for development' : null,
        production: !isDevelopment ? 'Enhanced security headers active' : null,
        general: 'Sensitive environment variables are never exposed in responses'
      },
      exposedEnvVars: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT
      }
    };
  }
}