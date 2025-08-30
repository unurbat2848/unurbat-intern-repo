# Screenshot Instructions for Issue 35

## Required Screenshots

### 1. Database Connection Setup
- **File**: `demo-project/nestjs/app.module.ts`
- **What to capture**: TypeORM configuration with PostgreSQL connection settings
- **Screenshot name**: `image-1.png`

### 2. User Entity
- **File**: `demo-project/nestjs/users/user.entity.ts`
- **What to capture**: Complete User entity with TypeORM decorators
- **Screenshot name**: `image-2.png`

### 3. User Service with Repository
- **File**: `demo-project/nestjs/users/users.service.ts`
- **What to capture**: CRUD operations using TypeORM Repository pattern
- **Screenshot name**: `image-3.png`

### 4. Users Controller
- **File**: `demo-project/nestjs/users/users.controller.ts`
- **What to capture**: REST API endpoints for user operations
- **Screenshot name**: `image-4.png`

### 5. TypeORM Module Registration
- **File**: `demo-project/nestjs/users/users.module.ts`
- **What to capture**: UsersModule with TypeORM.forFeature([User])
- **Screenshot name**: `image-5.png`

### 6. Project Structure
- **Directory**: `demo-project/nestjs/users/`
- **What to capture**: File structure showing entity, service, controller, module, and DTOs
- **Screenshot name**: `image-6.png`

### 7. Built Application
- **Terminal**: Build success output
- **What to capture**: Successful TypeScript compilation with no errors
- **Screenshot name**: `image-7.png`

All screenshots should be saved in: `7-building-APIs\connecting-to-postgresql-with-typeorm-in-nestjs\`