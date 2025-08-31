import { LoggerOptions } from 'pino';
import { ConfigService } from '@nestjs/config';

export const createPinoConfig = (configService: ConfigService): LoggerOptions => {
  const isDevelopment = configService.get<string>('app.environment') === 'development';
  const logLevel = configService.get<string>('LOG_LEVEL', 'info');

  const baseConfig: LoggerOptions = {
    level: logLevel,
    
    // Custom log format for production
    formatters: {
      level: (label) => ({ level: label }),
    },
    
    // Add timestamp
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
    
    // Custom serializers for error objects
    serializers: {
      err: (err) => ({
        type: err.constructor.name,
        message: err.message,
        stack: err.stack,
        ...err,
      }),
      req: (req) => ({
        method: req.method,
        url: req.url,
        headers: {
          host: req.headers?.host,
          'user-agent': req.headers?.['user-agent'],
          'content-type': req.headers?.['content-type'],
          // Don't log authorization headers for security
        },
        remoteAddress: req.remoteAddress,
        remotePort: req.remotePort,
      }),
      res: (res) => ({
        statusCode: res.statusCode,
        headers: {
          'content-type': res.getHeader('content-type'),
          'content-length': res.getHeader('content-length'),
        },
      }),
    },
  };

  // Pretty printing for development
  if (isDevelopment) {
    return {
      ...baseConfig,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          levelFirst: true,
          translateTime: 'yyyy-mm-dd HH:MM:ss.l',
          ignore: 'pid,hostname',
          messageFormat: '{req.method} {req.url} - {msg}',
          customLevels: 'silly:35',
          customColors: 'silly:magenta',
        },
      },
    };
  }

  return baseConfig;
};