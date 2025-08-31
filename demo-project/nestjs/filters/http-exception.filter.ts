import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLoggerService } from '../logging/custom-logger.service';

export interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | object;
  error?: string;
  requestId?: string;
  userId?: string;
  details?: any;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const user = (request as any).user;
    
    // Extract meaningful error information
    const errorMessage = typeof exceptionResponse === 'string' 
      ? exceptionResponse 
      : (exceptionResponse as any).message || exception.message;

    const errorDetails = typeof exceptionResponse === 'object' 
      ? exceptionResponse 
      : null;

    // Build structured error response
    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: errorMessage,
      requestId: request.headers['x-request-id'] as string,
      userId: user?.id || user?.sub,
    };

    // Add error name for client reference
    if (status >= 400 && status < 500) {
      errorResponse.error = this.getErrorName(status);
    }

    // Add validation details for bad requests
    if (status === HttpStatus.BAD_REQUEST && errorDetails) {
      errorResponse.details = this.formatValidationErrors(errorDetails);
    }

    // Log the exception with context
    this.logException(exception, request, status, user?.id);

    response.status(status).json(errorResponse);
  }

  private getErrorName(statusCode: number): string {
    const errorNames: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      405: 'Method Not Allowed',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      429: 'Too Many Requests',
    };

    return errorNames[statusCode] || 'Client Error';
  }

  private formatValidationErrors(errorDetails: any): any {
    // Handle class-validator errors
    if (errorDetails.message && Array.isArray(errorDetails.message)) {
      return {
        validationErrors: errorDetails.message,
        error: errorDetails.error || 'Validation failed',
      };
    }

    return errorDetails;
  }

  private logException(
    exception: HttpException,
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
    };

    if (statusCode >= 500) {
      // Server errors - log as error with full details
      this.logger.error(
        `HTTP ${statusCode} - ${exception.message}`,
        exception,
        logContext
      );
    } else if (statusCode >= 400) {
      // Client errors - log as warning
      this.logger.warn(`HTTP ${statusCode} - ${exception.message}`, logContext);
    }
  }
}