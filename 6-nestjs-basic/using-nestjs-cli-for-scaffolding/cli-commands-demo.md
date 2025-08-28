# NestJS CLI Commands Demo

## Commands I Used

### 1. Check CLI Help
```bash
npx @nestjs/cli --help
```
Shows all available commands and options.

### 2. Generate Module
```bash
npx @nestjs/cli generate module products
```
Created: `products/products.module.ts`

### 3. Generate Service
```bash
npx @nestjs/cli generate service products
```
Created: `products/products.service.ts` and test file
Updated: Module automatically imports the service

### 4. Generate Controller
```bash
npx @nestjs/cli generate controller products
```
Created: `products/products.controller.ts` and test file
Updated: Module automatically imports the controller

### 5. Dry Run Test
```bash
npx @nestjs/cli generate resource orders --dry-run
```
Shows what would be created without actually creating files

## Files Created by CLI

The CLI automatically created this structure:
```
products/
├── products.controller.spec.ts
├── products.controller.ts
├── products.module.ts
├── products.service.spec.ts
└── products.service.ts
```

## Module Auto-Update

The CLI automatically updated the module file to include:
- ProductsService in providers array
- ProductsController in controllers array
- Proper imports at the top

This shows how the CLI maintains modular architecture automatically!