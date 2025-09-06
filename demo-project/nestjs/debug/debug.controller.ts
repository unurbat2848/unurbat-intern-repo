import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  Req,
  Res,
  HttpStatus,
  UseInterceptors,
  Logger,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggingInterceptor } from '../common/logging.interceptor';
import { DebugService } from './debug.service';

// DTOs for demonstration
interface CreateUserDto {
  name: string;
  email: string;
  password?: string;
  role?: string;
}

interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: string;
}

// User type for mock data storage
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  updatedAt?: string;
  createdAt?: string;
}

@Controller('debug')
@UseInterceptors(LoggingInterceptor)
export class DebugController {
  private readonly logger = new Logger('DebugController');
  
  constructor(private readonly debugService: DebugService) {}
  
  // Mock data storage
  private users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  ];

  @Get('headers')
  inspectHeaders(@Headers() headers: any, @Req() req: Request) {
    this.logger.log('=== HEADER INSPECTION ===');
    this.logger.log(`All Headers: ${JSON.stringify(headers, null, 2)}`);
    this.logger.log(`User-Agent: ${req.get('User-Agent')}`);
    this.logger.log(`Content-Type: ${req.get('Content-Type')}`);
    this.logger.log(`Authorization: ${req.get('Authorization') ? '[Present]' : '[Missing]'}`);
    
    return {
      message: 'Headers inspected successfully',
      headers: {
        userAgent: req.get('User-Agent'),
        contentType: req.get('Content-Type'),
        authorization: req.get('Authorization') ? '[Present]' : '[Missing]',
        host: req.get('Host'),
        acceptLanguage: req.get('Accept-Language'),
      },
      allHeaders: headers,
    };
  }

  @Get('request-info')
  inspectRequestInfo(@Req() req: Request, @Query() query: any) {
    this.logger.log('=== REQUEST INFO INSPECTION ===');
    this.logger.log(`Method: ${req.method}`);
    this.logger.log(`URL: ${req.url}`);
    this.logger.log(`Original URL: ${req.originalUrl}`);
    this.logger.log(`Base URL: ${req.baseUrl}`);
    this.logger.log(`Path: ${req.path}`);
    this.logger.log(`Query: ${JSON.stringify(query)}`);
    this.logger.log(`IP: ${req.ip}`);
    this.logger.log(`IPs: ${JSON.stringify(req.ips)}`);
    this.logger.log(`Protocol: ${req.protocol}`);
    this.logger.log(`Secure: ${req.secure}`);
    
    return {
      method: req.method,
      url: req.url,
      originalUrl: req.originalUrl,
      baseUrl: req.baseUrl,
      path: req.path,
      query,
      ip: req.ip,
      ips: req.ips,
      protocol: req.protocol,
      secure: req.secure,
      hostname: req.hostname,
    };
  }

  @Post('users')
  createUser(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    this.logger.log('=== CREATE USER REQUEST ===');
    this.logger.log(`Request Body: ${JSON.stringify(createUserDto, null, 2)}`);
    
    // Validate required fields
    if (!createUserDto.name || !createUserDto.email) {
      this.logger.error('Validation failed: Missing required fields');
      throw new BadRequestException('Name and email are required');
    }
    
    // Simulate user creation
    const newUser = {
      id: this.users.length + 1,
      name: createUserDto.name,
      email: createUserDto.email,
      role: createUserDto.role || 'user',
      createdAt: new Date().toISOString(),
    };
    
    this.users.push(newUser);
    this.logger.log(`User created successfully: ${JSON.stringify(newUser)}`);
    
    return {
      message: 'User created successfully',
      user: newUser,
    };
  }

  @Get('users')
  getUsers(@Query() query: any) {
    this.logger.log('=== GET USERS REQUEST ===');
    this.logger.log(`Query Parameters: ${JSON.stringify(query)}`);
    
    let filteredUsers = [...this.users];
    
    // Apply filters if provided
    if (query.role) {
      filteredUsers = filteredUsers.filter(user => user.role === query.role);
      this.logger.log(`Filtered by role: ${query.role}`);
    }
    
    if (query.search) {
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(query.search.toLowerCase()) ||
        user.email.toLowerCase().includes(query.search.toLowerCase())
      );
      this.logger.log(`Filtered by search: ${query.search}`);
    }
    
    this.logger.log(`Returning ${filteredUsers.length} users`);
    
    return {
      users: filteredUsers,
      total: filteredUsers.length,
      filters: query,
    };
  }

  @Get('users/:id')
  getUserById(@Param('id') id: string) {
    this.logger.log('=== GET USER BY ID REQUEST ===');
    this.logger.log(`User ID: ${id}`);
    
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      this.logger.error(`Invalid user ID format: ${id}`);
      throw new BadRequestException('Invalid user ID format');
    }
    
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      this.logger.error(`User not found with ID: ${userId}`);
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    
    this.logger.log(`User found: ${JSON.stringify(user)}`);
    return { user };
  }

  @Put('users/:id')
  updateUser(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request
  ) {
    this.logger.log('=== UPDATE USER REQUEST ===');
    this.logger.log(`User ID: ${id}`);
    this.logger.log(`Update Data: ${JSON.stringify(updateUserDto)}`);
    
    const userId = parseInt(id, 10);
    const userIndex = this.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    
    // Update user
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateUserDto,
      updatedAt: new Date().toISOString(),
    };
    
    this.logger.log(`User updated: ${JSON.stringify(this.users[userIndex])}`);
    
    return {
      message: 'User updated successfully',
      user: this.users[userIndex],
    };
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    this.logger.log('=== DELETE USER REQUEST ===');
    this.logger.log(`User ID: ${id}`);
    
    const userId = parseInt(id, 10);
    const userIndex = this.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    
    const deletedUser = this.users.splice(userIndex, 1)[0];
    this.logger.log(`User deleted: ${JSON.stringify(deletedUser)}`);
    
    return {
      message: 'User deleted successfully',
      deletedUser,
    };
  }

  @Post('test-auth')
  testAuth(@Headers('authorization') auth: string) {
    this.logger.log('=== AUTH TEST REQUEST ===');
    this.logger.log(`Authorization header present: ${!!auth}`);
    
    if (!auth) {
      throw new UnauthorizedException('Authorization header is required');
    }
    
    if (!auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid authorization format. Use: Bearer <token>');
    }
    
    const token = auth.replace('Bearer ', '');
    this.logger.log(`Token extracted: ${token.substring(0, 10)}...`);
    
    return {
      message: 'Authorization successful',
      tokenLength: token.length,
    };
  }

  @Get('custom-response')
  customResponse(@Res() res: Response, @Query('status') status: string) {
    this.logger.log('=== CUSTOM RESPONSE TEST ===');
    
    const statusCode = status ? parseInt(status, 10) : 200;
    this.logger.log(`Custom status code: ${statusCode}`);
    
    // Set custom headers
    res.setHeader('X-Custom-Header', 'Debug-Response');
    res.setHeader('X-Response-Time', Date.now().toString());
    res.setHeader('X-Server-Info', 'NestJS-Debug-Server');
    
    const responseData = {
      message: `Custom response with status ${statusCode}`,
      timestamp: new Date().toISOString(),
      statusCode,
      customHeaders: {
        'X-Custom-Header': 'Debug-Response',
        'X-Response-Time': Date.now().toString(),
        'X-Server-Info': 'NestJS-Debug-Server',
      },
    };
    
    this.logger.log(`Sending response: ${JSON.stringify(responseData)}`);
    
    res.status(statusCode).json(responseData);
  }

  @Get('simulate-error/:type')
  simulateError(@Param('type') errorType: string) {
    this.logger.log('=== ERROR SIMULATION ===');
    this.logger.log(`Error type: ${errorType}`);
    
    switch (errorType) {
      case 'bad-request':
        throw new BadRequestException('Simulated bad request error');
      case 'not-found':
        throw new NotFoundException('Simulated not found error');
      case 'unauthorized':
        throw new UnauthorizedException('Simulated unauthorized error');
      case 'server-error':
        throw new Error('Simulated internal server error');
      default:
        throw new BadRequestException('Unknown error type. Use: bad-request, not-found, unauthorized, server-error');
    }
  }

  @Get('complex-processing/:number')
  async testComplexProcessing(@Param('number') numberStr: string) {
    this.logger.log('=== COMPLEX PROCESSING TEST ===');
    
    const inputNumber = parseFloat(numberStr);
    if (isNaN(inputNumber)) {
      throw new BadRequestException('Invalid number provided');
    }
    
    this.logger.log(`Starting complex processing for: ${inputNumber}`);
    
    // This method has multiple breakpoint opportunities
    const result = await this.debugService.processComplexData(inputNumber);
    
    this.logger.log(`Complex processing completed`);
    
    return {
      message: 'Complex processing completed successfully',
      result
    };
  }

  @Post('data-flow')
  testDataFlow(@Body() body: { numbers: number[] }) {
    this.logger.log('=== DATA FLOW DEBUG TEST ===');
    this.logger.log(`Input array: ${JSON.stringify(body.numbers)}`);
    
    if (!body.numbers || !Array.isArray(body.numbers)) {
      throw new BadRequestException('Request body must contain a "numbers" array');
    }
    
    // This method demonstrates data transformation with multiple steps
    const result = this.debugService.debugDataFlow(body.numbers);
    
    this.logger.log(`Data flow processing completed`);
    
    return {
      message: 'Data flow processing completed',
      result
    };
  }

  @Get('recursive/:depth')
  testRecursiveFunction(@Param('depth') depthStr: string) {
    this.logger.log('=== RECURSIVE FUNCTION DEBUG TEST ===');
    
    const depth = parseInt(depthStr, 10);
    if (isNaN(depth) || depth < 0 || depth > 10) {
      throw new BadRequestException('Depth must be a number between 0 and 10');
    }
    
    this.logger.log(`Testing recursive function with depth: ${depth}`);
    
    // This method demonstrates nested function calls perfect for step debugging
    const result = this.debugService.simulateNestedFunction(depth);
    
    this.logger.log(`Recursive function completed`);
    
    return {
      message: 'Recursive function test completed',
      result
    };
  }
}