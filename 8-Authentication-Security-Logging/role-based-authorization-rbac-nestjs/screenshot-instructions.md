# Screenshot Instructions for Role-Based Authorization (RBAC) in NestJS

Take screenshots to document your RBAC implementation and save them in the `8-Authentication-Security-Logging/role-based-authorization-rbac-nestjs/` folder.

## Screenshot 1: JWT Strategy Implementation
- **Filename**: `image.png`
- **Location**: Save in `8-Authentication-Security-Logging/role-based-authorization-rbac-nestjs/`
- **What to capture**: Open `demo-project/nestjs/auth/jwt.strategy.ts` in VS Code
- **Show**: The validate method showing how roles and permissions are extracted from Auth0 custom claims
- **Referenced in**: "How does Auth0 store and manage user roles?" section

## Screenshot 2: Role Enum and Types
- **Filename**: `image-1.png`
- **Location**: Save in `8-Authentication-Security-Logging/role-based-authorization-rbac-nestjs/`
- **What to capture**: Open `demo-project/nestjs/auth/roles.enum.ts` in VS Code
- **Show**: Role enum definition and UserPermission interface
- **Referenced in**: "How does Auth0 store and manage user roles?" section

## Screenshot 3: RBAC Guard Implementation
- **Filename**: `image-2.png`
- **Location**: Save in `8-Authentication-Security-Logging/role-based-authorization-rbac-nestjs/`
- **What to capture**: Open `demo-project/nestjs/auth/roles.guard.ts` in VS Code
- **Show**: The canActivate method and permission checking logic with wildcard support
- **Referenced in**: "What is the purpose of a guard in NestJS?" section

## Screenshot 4: JWT Auth Guard
- **Filename**: `image-3.png`
- **Location**: Save in `8-Authentication-Security-Logging/role-based-authorization-rbac-nestjs/`
- **What to capture**: Open `demo-project/nestjs/auth/jwt-auth.guard.ts` in VS Code
- **Show**: The simple JWT authentication guard implementation
- **Referenced in**: "What is the purpose of a guard in NestJS?" section

## Screenshot 5: Admin Controller with Protection
- **Filename**: `image-4.png`
- **Location**: Save in `8-Authentication-Security-Logging/role-based-authorization-rbac-nestjs/`
- **What to capture**: Open `demo-project/nestjs/auth/admin.controller.ts` in VS Code
- **Show**: Controller methods with @UseGuards, @Roles, and @Permissions decorators
- **Referenced in**: "How would you restrict access to an API endpoint based on user roles?" section

## Screenshot 6: Roles Decorator
- **Filename**: `image-5.png`
- **Location**: Save in `8-Authentication-Security-Logging/role-based-authorization-rbac-nestjs/`
- **What to capture**: Open `demo-project/nestjs/auth/roles.decorator.ts` in VS Code
- **Show**: The Roles and Permissions decorator implementations using SetMetadata
- **Referenced in**: "How would you restrict access to an API endpoint based on user roles?" section

## Screenshot 7: Token Service
- **Filename**: `image-6.png`
- **Location**: Save in `8-Authentication-Security-Logging/role-based-authorization-rbac-nestjs/`
- **What to capture**: Open `demo-project/nestjs/auth/token.service.ts` in VS Code
- **Show**: The generateDemoToken method showing different permission levels for different user types
- **Referenced in**: "What are the security risks of improper authorization, and how can they be mitigated?" section

## Screenshot 8: Demo Tokens Endpoint
- **Filename**: `image-7.png`
- **Location**: Save in `8-Authentication-Security-Logging/role-based-authorization-rbac-nestjs/`
- **What to capture**: Open `demo-project/nestjs/auth/tokens.controller.ts` in VS Code
- **Show**: The getDemoTokens method with testing instructions and endpoint descriptions
- **Referenced in**: "What are the security risks of improper authorization, and how can they be mitigated?" section

## Screenshot 9: RBAC System Demo
- **Filename**: `image-8.png`
- **Location**: Save in `8-Authentication-Security-Logging/role-based-authorization-rbac-nestjs/`
- **What to capture**: Postman or browser making requests to `/api/auth/tokens/demo` endpoint
- **Show**: The API response showing different tokens and testing instructions for RBAC endpoints
- **Referenced in**: "What are the security risks of improper authorization, and how can they be mitigated?" section