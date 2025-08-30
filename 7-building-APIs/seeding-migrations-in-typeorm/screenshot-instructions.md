# Screenshot Instructions for Issue 34

## Required Screenshots

### 1. Migration Configuration
- **File**: `demo-project/ormconfig.js`
- **What to capture**: TypeORM DataSource configuration for migrations
- **Screenshot name**: `image-1.png`

### 2. Initial Schema Migration
- **File**: `demo-project/migrations/1735633200000-InitialSchema.ts`
- **What to capture**: First migration showing up() and down() methods for users and tasks tables
- **Screenshot name**: `image-2.png`

### 3. Schema Change Migration
- **File**: `demo-project/migrations/1735633300000-AddTaskPriority.ts`
- **What to capture**: Second migration adding priority and dueDate columns to tasks table
- **Screenshot name**: `image-3.png`

### 4. Updated Task Entity
- **File**: `demo-project/nestjs/tasks/task.entity.ts`
- **What to capture**: Task entity with all fields including priority and dueDate
- **Screenshot name**: `image-4.png`

### 5. Seed Service
- **File**: `demo-project/nestjs/seeding/seed.service.ts`
- **What to capture**: SeedService with methods for seeding users and tasks
- **Screenshot name**: `image-5.png`

### 6. Package.json Scripts
- **File**: `demo-project/package.json`
- **What to capture**: Migration and seeding scripts section
- **Screenshot name**: `image-6.png`

### 7. Project Structure
- **Directory**: `demo-project/`
- **What to capture**: File structure showing migrations/ and scripts/ directories
- **Screenshot name**: `image-7.png`

All screenshots should be saved in: `7-building-APIs\seeding-migrations-in-typeorm\`