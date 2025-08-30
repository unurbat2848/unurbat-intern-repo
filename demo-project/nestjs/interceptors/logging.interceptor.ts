import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    const { method, url, body } = request;
    const userAgent = request.get('User-Agent') || '';
    
    this.logger.log(`📥 Incoming Request: ${method} ${url} - ${userAgent}`);
    
    if (Object.keys(body || {}).length > 0) {
      this.logger.log(`📦 Request Body: ${JSON.stringify(body)}`);
    }

    const startTime = Date.now();

    return next.handle().pipe(
      tap((responseData) => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        this.logger.log(
          `📤 Outgoing Response: ${method} ${url} - Status: ${response.statusCode} - Duration: ${duration}ms`
        );
        
        if (responseData) {
          this.logger.log(`📋 Response Data: ${JSON.stringify(responseData)}`);
        }
      })
    );
  }
}