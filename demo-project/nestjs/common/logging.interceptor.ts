import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('API');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, body, headers, query, params } = request;
    const userAgent = request.get('User-Agent') || '';
    const ip = request.ip;

    // Log incoming request details
    this.logger.log(`📨 Incoming Request: ${method} ${url}`);
    this.logger.log(`🌐 IP: ${ip} | User-Agent: ${userAgent}`);
    
    // Log headers (excluding sensitive ones)
    const filteredHeaders = this.filterSensitiveHeaders(headers);
    this.logger.log(`📋 Headers: ${JSON.stringify(filteredHeaders, null, 2)}`);
    
    // Log query parameters
    if (Object.keys(query).length > 0) {
      this.logger.log(`🔍 Query Params: ${JSON.stringify(query, null, 2)}`);
    }
    
    // Log path parameters
    if (Object.keys(params).length > 0) {
      this.logger.log(`🎯 Path Params: ${JSON.stringify(params, null, 2)}`);
    }
    
    // Log request body (excluding sensitive fields)
    if (body && Object.keys(body).length > 0) {
      const filteredBody = this.filterSensitiveData(body);
      this.logger.log(`📦 Request Body: ${JSON.stringify(filteredBody, null, 2)}`);
    }

    const startTime = Date.now();

    return next.handle().pipe(
      tap((data) => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        this.logger.log(`📤 Response: ${method} ${url}`);
        this.logger.log(`✅ Status: ${response.statusCode} | Duration: ${duration}ms`);
        
        // Log response data (truncate if too large)
        if (data) {
          const responseData = this.truncateResponse(data);
          this.logger.log(`📋 Response Data: ${JSON.stringify(responseData, null, 2)}`);
        }
      }),
      catchError((error) => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        this.logger.error(`❌ Error Response: ${method} ${url}`);
        this.logger.error(`💥 Status: ${error.status || 500} | Duration: ${duration}ms`);
        this.logger.error(`🔥 Error: ${error.message}`);
        
        if (error.stack) {
          this.logger.error(`📚 Stack Trace: ${error.stack}`);
        }
        
        throw error;
      }),
    );
  }

  private filterSensitiveHeaders(headers: any): any {
    const sensitiveHeaders = [
      'authorization', 
      'cookie', 
      'x-api-key', 
      'x-auth-token',
      'x-csrf-token',
      'set-cookie'
    ];
    
    const filtered = { ...headers };
    
    sensitiveHeaders.forEach(header => {
      if (filtered[header]) {
        filtered[header] = '[REDACTED]';
      }
    });
    
    return filtered;
  }

  private filterSensitiveData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sensitiveFields = [
      'password', 
      'token', 
      'apiKey', 
      'secret', 
      'creditCard',
      'ssn',
      'email' // Sometimes we want to hide emails in logs
    ];
    
    const filtered = Array.isArray(data) ? [...data] : { ...data };
    
    const filterObject = (obj: any) => {
      Object.keys(obj).forEach(key => {
        if (sensitiveFields.some(field => 
          key.toLowerCase().includes(field.toLowerCase())
        )) {
          obj[key] = '[REDACTED]';
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          filterObject(obj[key]);
        }
      });
    };
    
    if (Array.isArray(filtered)) {
      filtered.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          filterObject(item);
        }
      });
    } else {
      filterObject(filtered);
    }
    
    return filtered;
  }

  private truncateResponse(data: any): any {
    const maxLength = 1000; // Maximum characters for response data
    const dataString = JSON.stringify(data);
    
    if (dataString.length > maxLength) {
      return {
        ...data,
        _truncated: true,
        _originalLength: dataString.length,
        _message: `Response truncated (${dataString.length} characters total)`
      };
    }
    
    return data;
  }
}