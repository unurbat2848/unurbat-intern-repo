# Role-Based Authorization (RBAC) in NestJS with Auth0

This project demonstrates how to implement **Role-Based Access Control (RBAC)** in a NestJS application using Auth0-style JWT tokens.

## 🚀 Quick Start

### 1. Get Demo Tokens
```bash
GET http://localhost:3000/api/auth/tokens/demo
```
This returns JWT tokens for different user types: admin, moderator, and user.

### 2. Test Protected Endpoints
Use the tokens in Authorization header:
```bash
Authorization: Bearer <your-token-here>
```

## 📋 Test Endpoints

### Get Demo Tokens
```bash
GET /api/auth/tokens/demo
```
Returns tokens for all user types with usage instructions.

### Admin Dashboard (Role-Based)
```bash
GET /api/admin/dashboard
Authorization: Bearer <admin-or-moderator-token>
```
- Requires: `admin` or `moderator` role

### User Management (Permission-Based)
```bash
GET /api/admin/users
Authorization: Bearer <token-with-users:read>
```
- Requires: `users:read` permission

```bash
POST /api/admin/users
Content-Type: application/json
Authorization: Bearer <token-with-users:create>

{
  "name": "New User",
  "email": "newuser@example.com"
}
```
- Requires: `users:create` permission

### System Settings (Admin Only)
```bash
GET /api/admin/system-settings
Authorization: Bearer <admin-token>
```
- Requires: `admin` role only

### Reports (Multiple Permissions)
```bash
GET /api/admin/reports
Authorization: Bearer <token-with-both-permissions>
```
- Requires: `reports:read` AND `analytics:read` permissions

### Profile (Authentication Only)
```bash
GET /api/admin/profile
Authorization: Bearer <any-valid-token>
```
- Requires: Valid JWT token (any role)

## 🏗️ Architecture

### Auth0 Token Structure
```typescript
// Example JWT payload from Auth0
{
  "sub": "user-123",
  "email": "user@example.com",
  "name": "John Doe",
  "https://api.focusbear.app/roles": ["admin"],
  "https://api.focusbear.app/permissions": [
    "users:read",
    "users:create",
    "system:write"
  ]
}
```

### Role Hierarchy
1. **Admin** - Full access to everything
2. **Moderator** - Dashboard access + limited user management
3. **User** - Profile access only

### Permission System
- **users:read** - View user list
- **users:create** - Create new users  
- **users:update** - Modify existing users
- **users:delete** - Remove users
- **system:read** - View system settings
- **system:write** - Modify system settings
- **reports:read** - View reports
- **analytics:read** - View analytics

### Wildcard Permissions
- **users:\*** - All user operations
- **\*:\*** - Super admin (all operations)

## 🔧 Implementation Details

### 1. JWT Strategy (`jwt.strategy.ts`)
Extracts roles and permissions from Auth0 custom claims:
```typescript
const roles = payload['https://api.focusbear.app/roles'] || [];
const permissions = payload['https://api.focusbear.app/permissions'] || [];
```

### 2. Roles Guard (`roles.guard.ts`)
Enforces role and permission requirements:
- Checks required roles from `@Roles()` decorator
- Checks required permissions from `@Permissions()` decorator
- Supports wildcard permissions
- Admin role bypasses all restrictions

### 3. Decorators
```typescript
@Roles(Role.ADMIN, Role.MODERATOR)     // Requires admin OR moderator
@Permissions('users:read')              // Requires specific permission
@Permissions('reports:read', 'analytics:read') // Requires BOTH permissions
```

### 4. Guard Application
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
```
- `JwtAuthGuard` validates JWT and extracts user
- `RolesGuard` enforces roles/permissions

## 🧪 Testing Different Scenarios

### Admin User
- Token includes: `admin` role + all permissions
- Can access: All endpoints
- Use case: System administration

### Moderator User  
- Token includes: `moderator` role + limited permissions
- Can access: Dashboard, user viewing
- Cannot access: System settings, user creation
- Use case: Content moderation

### Regular User
- Token includes: `user` role + no permissions
- Can access: Only profile endpoint
- Use case: Standard application usage

## 🔒 Security Features

1. **Token Validation**: JWT signature verification
2. **Role Verification**: User must have required role
3. **Permission Checking**: Fine-grained access control
4. **Wildcard Support**: Flexible permission hierarchy
5. **Admin Override**: Admin role bypasses restrictions
6. **Multi-Permission**: AND logic for multiple permissions

## ⚙️ Configuration

### Environment Variables
```bash
JWT_SECRET=your-secret-key
# In production with Auth0:
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=https://your-api.com
```

### Auth0 Dashboard Setup
1. Enable RBAC for your API
2. Create permissions (e.g., `users:read`)
3. Create roles and assign permissions
4. Add custom claims rule for roles/permissions
5. Assign roles to users

## 📝 Example Flows

### 1. Admin Creating User
```bash
# 1. Get admin token
GET /api/auth/tokens/demo/admin

# 2. Create user with token
POST /api/admin/users
Authorization: Bearer <admin-token>
```

### 2. Moderator Viewing Dashboard  
```bash
# 1. Get moderator token
GET /api/auth/tokens/demo/moderator

# 2. Access dashboard
GET /api/admin/dashboard
Authorization: Bearer <moderator-token>
```

### 3. User Accessing Restricted Endpoint
```bash
# 1. Get user token
GET /api/auth/tokens/demo/user

# 2. Try to access admin endpoint (will fail with 403)
GET /api/admin/users
Authorization: Bearer <user-token>
```

This implementation provides a complete RBAC system that scales from simple role checks to complex permission-based authorization.