import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import { CustomLoggerService } from './custom-logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    
    const startTime = Date.now();
    const { method, url, headers, body } = request;
    
    // Extract user information if available (from JWT token)
    const user = (request as any).user;
    const userId = user?.id || user?.sub;
    
    // Log incoming request
    this.logger.info(`Incoming ${method} ${url}`, {
      method,
      url,
      userId,
      userAgent: headers['user-agent'],
      contentType: headers['content-type'],
      requestId: headers['x-request-id'],
      bodySize: body ? JSON.stringify(body).length : 0,
      category: 'http-request',
    });

    return next.handle().pipe(
      tap((responseData) => {
        const duration = Date.now() - startTime;
        
        // Log successful response
        this.logger.info(`Response ${method} ${url}`, {
          method,
          url,
          statusCode: response.statusCode,
          duration,
          userId,
          responseSize: responseData ? JSON.stringify(responseData).length : 0,
          category: 'http-response',
        });
        
        // Log performance metrics for slow requests
        if (duration > 1000) {
          this.logger.logPerformanceMetric(
            'slow-request',
            duration,
            'ms',
            { method, url, statusCode: response.statusCode }
          );
        }
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        
        // Log error response
        this.logger.error(`Error ${method} ${url}`, error, {
          method,
          url,
          statusCode: error.status || 500,
          duration,
          userId,
          errorType: error.constructor.name,
          category: 'http-error',
        });
        
        // Re-throw the error so it can be handled by exception filters
        throw error;
      }),
    );
  }
}