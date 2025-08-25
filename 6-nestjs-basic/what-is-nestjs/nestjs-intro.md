# What is NestJS? 

## What are the key differences between NestJS and Express.js?

NestJS is a framework built on top of Express.js (or optionally Fastify), but it adds a lot of structure and features for building scalable, maintainable server-side applications. While Express.js is minimal and unopinionated—letting me organize code however I want—NestJS enforces a modular, layered architecture with controllers, services, and modules. NestJS also includes built-in support for dependency injection, testing, validation, and more, making it better suited for large or complex projects.

## Why does NestJS use decorators extensively?

NestJS uses decorators (like `@Controller()`, `@Get()`, `@Injectable()`) to make code more declarative and readable. Decorators let me define routes, inject dependencies, and configure metadata directly above classes and methods. This approach makes the codebase easier to understand and maintain, and it enables powerful features like automatic routing and validation.

## How does NestJS handle dependency injection?

NestJS has a built-in dependency injection system inspired by Angular. I can mark classes as `@Injectable()`, and NestJS will automatically provide their dependencies when needed. This makes it easy to manage and swap out services, mock dependencies for testing, and keep code loosely coupled.

## What benefits does modular architecture provide in a large-scale app?

Modular architecture in NestJS means I can split my app into self-contained modules, each responsible for a specific feature or domain. This makes the codebase easier to organize, test, and maintain. In large-scale apps, modules help teams work independently, reduce code conflicts, and make it simpler to add or remove features without breaking everything else.

For example 
- In an e-commerce app, we might have separate modules for users, products, orders, and payments. Each module contains its own controllers, services, and entities.

This modular approach allows us to develop, test, and deploy features independently, and even reuse modules across different projects.
