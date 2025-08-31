import { Injectable } from '@nestjs/common';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';

@Injectable()
export class CustomLoggerService {
  constructor(
    @InjectPinoLogger(CustomLoggerService.name) 
    private readonly logger: PinoLogger
  ) {}

  // Standard log levels
  debug(message: string, context?: object) {
    this.logger.debug(context, message);
  }

  info(message: string, context?: object) {
    this.logger.info(context, message);
  }

  warn(message: string, context?: object) {
    this.logger.warn(context, message);
  }

  error(message: string, error?: Error, context?: object) {
    this.logger.error({
      err: error,
      ...context,
    }, message);
  }

  // Business logic specific logging methods
  logUserAction(userId: string, action: string, details?: object) {
    this.logger.info({
      userId,
      action,
      category: 'user-action',
      ...details,
    }, `User action: ${action}`);
  }

  logApiRequest(method: string, url: string, userId?: string, duration?: number) {
    this.logger.info({
      method,
      url,
      userId,
      duration,
      category: 'api-request',
    }, `API Request: ${method} ${url}`);
  }

  logDatabaseQuery(query: string, duration: number, affected?: number) {
    this.logger.debug({
      query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
      duration,
      affected,
      category: 'database',
    }, 'Database query executed');
  }

  logSecurityEvent(event: string, userId?: string, ip?: string, details?: object) {
    this.logger.warn({
      event,
      userId,
      ip,
      category: 'security',
      ...details,
    }, `Security event: ${event}`);
  }

  logJobProcessing(jobId: string, jobType: string, status: 'started' | 'completed' | 'failed', duration?: number) {
    const level = status === 'failed' ? 'error' : 'info';
    
    this.logger[level]({
      jobId,
      jobType,
      status,
      duration,
      category: 'job-processing',
    }, `Job ${status}: ${jobType}`);
  }

  logExternalApiCall(service: string, endpoint: string, method: string, statusCode: number, duration: number) {
    const level = statusCode >= 400 ? 'warn' : 'info';
    
    this.logger[level]({
      service,
      endpoint,
      method,
      statusCode,
      duration,
      category: 'external-api',
    }, `External API call: ${service} ${method} ${endpoint}`);
  }

  logConfigurationIssue(issue: string, details?: object) {
    this.logger.error({
      issue,
      category: 'configuration',
      ...details,
    }, `Configuration issue: ${issue}`);
  }

  // Performance logging
  logPerformanceMetric(metric: string, value: number, unit: string, context?: object) {
    this.logger.info({
      metric,
      value,
      unit,
      category: 'performance',
      ...context,
    }, `Performance metric: ${metric} = ${value}${unit}`);
  }

  // Structured logging for business events
  logBusinessEvent(event: string, data: object) {
    this.logger.info({
      event,
      category: 'business-event',
      ...data,
    }, `Business event: ${event}`);
  }
}