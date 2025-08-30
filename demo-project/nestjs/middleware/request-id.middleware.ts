import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestIdMiddleware.name);

  use(req: Request & { requestId?: string }, res: Response, next: NextFunction) {
    // Generate unique request ID
    const requestId = uuidv4().slice(0, 8);
    
    // Add request ID to request object
    req.requestId = requestId;
    
    // Add request ID to response headers
    res.setHeader('X-Request-ID', requestId);
    
    this.logger.log(`🆔 Request ID assigned: ${requestId} for ${req.method} ${req.url}`);
    
    next();
  }
}