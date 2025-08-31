import { Module, Global } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { createPinoConfig } from './pino.config';
import { CustomLoggerService } from './custom-logger.service';
import { LoggingInterceptor } from './logging.interceptor';
import { DemoLoggingController } from './demo-logging.controller';

@Global()
@Module({
  imports: [
    LoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          ...createPinoConfig(configService),
          
          // Automatic request logging
          autoLogging: true,
          
          // Custom success message
          successMessage: 'Request completed',
          
          // Custom error message  
          errorMessage: 'Request errored',
          
          // Custom request ID generation
          genReqId: (req) => req.headers['x-request-id'] || require('uuid').v4(),
          
          // Custom log level per request
          customLogLevel: (req, res, err) => {
            if (res.statusCode >= 400 && res.statusCode < 500) return 'warn';
            if (res.statusCode >= 500 || err) return 'error';
            return 'info';
          },
          
          // Redact sensitive information
          redact: {
            paths: [
              'req.headers.authorization',
              'req.headers.cookie',
              'req.body.password',
              'req.body.email',
              'req.body.token',
              'res.headers["set-cookie"]',
            ],
            censor: '[REDACTED]',
          },
          
          // Custom request serializer
          customSuccessMessage: (req, res) => {
            return `${req.method} ${req.url} completed`;
          },
          
          // Custom error serializer
          customErrorMessage: (req, res, err) => {
            return `${req.method} ${req.url} errored with ${err.message}`;
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [DemoLoggingController],
  providers: [
    CustomLoggerService,
    LoggingInterceptor,
  ],
  exports: [
    CustomLoggerService,
    LoggingInterceptor,
  ],
})
export class LoggingModule {}