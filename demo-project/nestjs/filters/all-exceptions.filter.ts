import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLoggerService } from '../logging/custom-logger.service';
import { ErrorResponse } from './http-exception.filter';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    let status: number;
    let message: string;
    let errorName: string;

    if (exception instanceof HttpException) {
      // HTTP exceptions (already handled by HttpExceptionFilter, but as fallback)
      status = exception.getStatus();
      message = exception.message;
      errorName = exception.constructor.name;
    } else if (exception instanceof Error) {
      // Handle known error types
      const errorHandlers = this.getErrorHandlers();
      const handler = errorHandlers.find(h => exception instanceof h.errorClass);
      
      if (handler) {
        status = handler.statusCode;
        message = handler.message(exception);
        errorName = handler.errorName;
      } else {
        // Unknown errors
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Internal server error';
        errorName = 'InternalServerError';
      }
    } else {
      // Non-Error objects
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'An unexpected error occurred';
      errorName = 'UnknownError';
    }

    const user = (request as any).user;
    
    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error: errorName,
      requestId: request.headers['x-request-id'] as string,
      userId: user?.id || user?.sub,
    };

    // Log all uncaught exceptions as errors
    this.logUncaughtException(exception, request, status, user?.id);

    response.status(status).json(errorResponse);
  }

  private getErrorHandlers() {
    return [
      // Database errors
      {
        errorClass: Error, // This will catch QueryFailedError from TypeORM
        statusCode: HttpStatus.BAD_REQUEST,
        errorName: 'DatabaseError',
        message: (err: Error) => {
          if (err.message.includes('duplicate key')) {
            return 'Resource already exists';
          }
          if (err.message.includes('foreign key')) {
            return 'Invalid reference to related resource';
          }
          if (err.message.includes('not null')) {
            return 'Required field is missing';
          }
          return 'Database operation failed';
        },
      },
      
      // Validation errors
      {
        errorClass: TypeError,
        statusCode: HttpStatus.BAD_REQUEST,
        errorName: 'ValidationError',
        message: () => 'Invalid input data',
      },
      
      // JWT errors
      {
        errorClass: Error, // JsonWebTokenError, TokenExpiredError, etc.
        statusCode: HttpStatus.UNAUTHORIZED,
        errorName: 'AuthenticationError',
        message: (err: Error) => {
          if (err.name === 'TokenExpiredError') return 'Token has expired';
          if (err.name === 'JsonWebTokenError') return 'Invalid token';
          if (err.name === 'NotBeforeError') return 'Token not active';
          return 'Authentication failed';
        },
      },
    ];
  }

  private logUncaughtException(
    exception: unknown,
    request: Request,
    statusCode: number,
    userId?: string,
  ) {
    const logContext = {
      statusCode,
      method: request.method,
      url: request.url,
      userId,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
      requestId: request.headers['x-request-id'],
      exceptionType: exception?.constructor?.name || typeof exception,
    };

    if (exception instanceof Error) {
      this.logger.error(
        `Uncaught Exception: ${exception.message}`,
        exception,
        logContext
      );
    } else {
      this.logger.error(
        `Uncaught Exception: ${JSON.stringify(exception)}`,
        undefined,
        logContext
      );
    }

    // Log security events for suspicious patterns
    if (statusCode === HttpStatus.UNAUTHORIZED || statusCode === HttpStatus.FORBIDDEN) {
      this.logger.logSecurityEvent(
        'unauthorized_access_attempt',
        userId,
        request.ip,
        { path: request.url, method: request.method, userAgent: request.headers['user-agent'] }
      );
    }
  }
}