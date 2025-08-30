import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger, HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorHandlingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorHandlingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    return next.handle().pipe(
      catchError((error) => {
        const requestId = (request as any).requestId || 'unknown';
        
        this.logger.error(
          `❌ Error in ${request.method} ${request.url} - Request ID: ${requestId}`,
          error.stack
        );
        
        // If it's already an HTTP exception, just pass it through
        if (error instanceof HttpException) {
          return throwError(() => error);
        }
        
        // For unexpected errors, log more details and wrap in generic error
        this.logger.error(`Unexpected error details: ${JSON.stringify(error)}`);
        
        return throwError(() => new HttpException('Internal server error', 500));
      })
    );
  }
}