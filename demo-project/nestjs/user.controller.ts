import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { EmailService } from './email.service';
import { LoggerService } from './logger.service';

// Controller that demonstrates dependency injection
@Controller('users')
export class UserController {
  // This is where dependency injection happens!
  // NestJS automatically provides these services when creating the controller
  constructor(
    private readonly userService: UserService,        // SINGLETON scope
    private readonly emailService: EmailService,      // REQUEST scope  
    private readonly loggerService: LoggerService     // TRANSIENT scope
  ) {
    this.loggerService.log('UserController created');
  }

  // Get all users
  @Get()
  getAllUsers() {
    this.loggerService.log('Getting all users');
    const users = this.userService.getAllUsers();
    return users;
  }

  // Get user by ID
  @Get(':id')
  getUser(@Param('id') id: string) {
    this.loggerService.log(`Getting user with ID: ${id}`);
    const user = this.userService.findUserById(Number(id));
    
    if (user) {
      this.emailService.sendNotification(user.email, 'Your profile was viewed');
    }
    
    return user;
  }

  // Create new user
  @Post()
  createUser(@Body() userData: { name: string; email: string }) {
    this.loggerService.log(`Creating new user: ${userData.name}`);
    
    // Use UserService to create user
    const newUser = this.userService.createUser(userData.name, userData.email);
    
    // Use EmailService to send welcome email
    this.emailService.sendWelcomeEmail(newUser.email, newUser.name);
    
    return newUser;
  }

  // Show logger instance ID (demonstrates TRANSIENT scope)
  @Get('debug/logger')
  getLoggerInfo() {
    return {
      message: 'Logger instance info',
      instanceId: this.loggerService.getInstanceId()
    };
  }

  // Show email history (demonstrates REQUEST scope)
  @Get('debug/emails')
  getEmailHistory() {
    return {
      message: 'Emails sent in this request',
      emails: this.emailService.getEmailHistory()
    };
  }
}