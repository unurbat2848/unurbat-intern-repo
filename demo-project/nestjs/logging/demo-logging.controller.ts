import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { CustomLoggerService } from './custom-logger.service';
import { LoggingInterceptor } from './logging.interceptor';

interface CreateUserDto {
  name: string;
  email: string;
}

@Controller('logging-demo')
@UseInterceptors(LoggingInterceptor)
export class DemoLoggingController {
  constructor(private readonly logger: CustomLoggerService) {}

  @Get('success')
  getSuccess() {
    this.logger.info('Successful operation requested');
    
    this.logger.logUserAction('user-123', 'view_dashboard', {
      section: 'main',
      feature: 'logging-demo',
    });

    return {
      success: true,
      message: 'This is a successful response',
      timestamp: new Date().toISOString(),
      data: {
        logs: 'Check your console for structured logs',
        features: ['info logging', 'user action tracking'],
      },
    };
  }

  @Get('slow')
  async getSlowEndpoint() {
    this.logger.info('Slow endpoint requested - simulating delay');
    
    // Simulate slow operation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    this.logger.logPerformanceMetric('slow-operation', 2000, 'ms', {
      endpoint: '/logging-demo/slow',
      operation: 'simulated-delay',
    });

    return {
      success: true,
      message: 'Slow operation completed',
      duration: '2 seconds',
    };
  }

  @Get('error-400')
  getBadRequest() {
    this.logger.warn('Bad request example triggered');
    
    throw new HttpException(
      {
        message: 'Bad request example',
        details: 'This is an intentional 400 error for demonstration',
        code: 'DEMO_BAD_REQUEST',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  @Get('error-401')
  getUnauthorized() {
    this.logger.logSecurityEvent(
      'unauthorized_access_demo',
      undefined,
      '127.0.0.1',
      { endpoint: '/logging-demo/error-401' }
    );

    throw new HttpException(
      'Unauthorized access - demo error',
      HttpStatus.UNAUTHORIZED,
    );
  }

  @Get('error-500')
  getServerError() {
    this.logger.error('Server error demo triggered', new Error('Demo server error'));
    
    throw new HttpException(
      'Internal server error demo',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Get('uncaught-error')
  getUncaughtError() {
    this.logger.warn('About to throw uncaught error for demonstration');
    
    // This will be caught by the AllExceptionsFilter
    throw new Error('This is an uncaught error for demonstration');
  }

  @Post('create-user')
  createUser(@Body() userData: CreateUserDto) {
    this.logger.info('User creation requested', {
      email: userData.email, // This will be redacted in logs
      hasName: !!userData.name,
    });

    // Simulate validation
    if (!userData.name || !userData.email) {
      this.logger.warn('User creation failed - missing required fields', {
        hasName: !!userData.name,
        hasEmail: !!userData.email,
      });
      
      throw new HttpException(
        {
          message: ['name should not be empty', 'email should not be empty'],
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Simulate successful creation
    const userId = `user-${Date.now()}`;
    
    this.logger.logBusinessEvent('user_created', {
      userId,
      email: userData.email,
      source: 'api',
    });

    this.logger.logUserAction(userId, 'account_created', {
      method: 'api',
      hasProfile: true,
    });

    return {
      success: true,
      message: 'User created successfully',
      userId,
      name: userData.name,
    };
  }

  @Get('database-demo')
  getDatabaseDemo() {
    // Simulate database operations with logging
    const startTime = Date.now();
    
    this.logger.info('Database operation started');
    
    // Simulate query
    setTimeout(() => {
      const duration = Date.now() - startTime;
      
      this.logger.logDatabaseQuery(
        'SELECT * FROM users WHERE active = true ORDER BY created_at DESC',
        duration,
        25
      );
    }, 100);

    return {
      success: true,
      message: 'Database operation completed',
      note: 'Check logs for database query information',
    };
  }

  @Get('external-api-demo')
  async getExternalApiDemo() {
    this.logger.info('External API call demonstration');
    
    // Simulate external API call
    const startTime = Date.now();
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const duration = Date.now() - startTime;
      
      this.logger.logExternalApiCall(
        'openai',
        '/v1/chat/completions',
        'POST',
        200,
        duration
      );

      return {
        success: true,
        message: 'External API call successful',
        service: 'OpenAI Demo',
        duration: `${duration}ms`,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.logger.logExternalApiCall(
        'openai',
        '/v1/chat/completions',
        'POST',
        500,
        duration
      );
      
      throw error;
    }
  }

  @Get('job-demo/:jobId')
  getJobDemo(@Param('jobId') jobId: string) {
    this.logger.logJobProcessing(jobId, 'email-sending', 'started');
    
    // Simulate job processing
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate
      
      if (success) {
        this.logger.logJobProcessing(jobId, 'email-sending', 'completed', 2500);
      } else {
        this.logger.logJobProcessing(jobId, 'email-sending', 'failed', 1200);
      }
    }, 100);

    return {
      success: true,
      message: `Job ${jobId} processing started`,
      note: 'Check logs for job completion status',
    };
  }
}