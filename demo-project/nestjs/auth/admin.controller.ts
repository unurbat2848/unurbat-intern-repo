import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles, Permissions } from './roles.decorator';
import { Role } from './roles.enum';
import { AuthenticatedUser } from './jwt.strategy';

interface AdminRequest extends Request {
  user: AuthenticatedUser;
}

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  
  @Get('dashboard')
  @Roles(Role.ADMIN, Role.MODERATOR)
  getDashboard(@Request() req: AdminRequest) {
    return {
      message: 'Admin Dashboard - Only accessible by admins and moderators',
      user: req.user,
      timestamp: new Date(),
      data: {
        totalUsers: 150,
        activeUsers: 120,
        todayRegistrations: 5,
      }
    };
  }

  @Get('users')
  @Permissions('users:read')
  getAllUsers(@Request() req: AdminRequest) {
    return {
      message: 'User Management - Requires users:read permission',
      user: req.user,
      users: [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'moderator' },
      ]
    };
  }

  @Post('users')
  @Permissions('users:create')
  createUser(@Body() userData: any, @Request() req: AdminRequest) {
    return {
      message: 'User created successfully - Requires users:create permission',
      user: req.user,
      createdUser: {
        id: Math.floor(Math.random() * 1000),
        ...userData,
        createdAt: new Date(),
        createdBy: req.user.email,
      }
    };
  }

  @Get('system-settings')
  @Roles(Role.ADMIN)
  getSystemSettings(@Request() req: AdminRequest) {
    return {
      message: 'System Settings - Only admins can access this',
      user: req.user,
      settings: {
        maintenanceMode: false,
        maxUsers: 1000,
        backupSchedule: 'daily',
        logLevel: 'info',
      }
    };
  }

  @Post('system-settings')
  @Permissions('system:write')
  updateSystemSettings(@Body() settings: any, @Request() req: AdminRequest) {
    return {
      message: 'System settings updated - Requires system:write permission',
      user: req.user,
      updatedSettings: settings,
      updatedAt: new Date(),
    };
  }

  @Get('reports')
  @Permissions('reports:read', 'analytics:read')
  getReports(@Request() req: AdminRequest) {
    return {
      message: 'Analytics Reports - Requires reports:read AND analytics:read permissions',
      user: req.user,
      reports: {
        dailyActiveUsers: 85,
        weeklySignups: 25,
        conversionRate: '12.5%',
        revenue: '$1,250',
      }
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: AdminRequest) {
    // This endpoint only requires authentication, no specific roles
    return {
      message: 'User profile - Accessible to all authenticated users',
      user: req.user,
      profileData: {
        lastLogin: new Date(),
        loginCount: 42,
        preferences: {
          theme: 'dark',
          language: 'en',
        }
      }
    };
  }
}