# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is an intern learning repository documenting Focus Bear internship progress through structured learning modules. The repository serves as a personal knowledge base capturing reflections, code examples, and technical learnings across different technology domains.

## Commands

### Testing
```bash
npm test          # Run all Jest tests
jest test.test.js # Run specific test file
```

### Code Quality
```bash
npm run lint      # ESLint with automatic fixes (configured via lint-staged)
```

### Git Hooks
- Husky is configured with lint-staged to automatically run ESLint fixes on staged JavaScript files before commits

## Repository Structure

The codebase is organized into numbered learning modules:

- `1-learn-about-focus-bear-and-set-your-goals/` - Company onboarding and goal setting
- `2-set-up-tools/` - Development environment setup (VS Code, Git, Terminal, AI tools)  
- `3-Learn-git/` - Git fundamentals, advanced commands, branching, pull requests
- `4-clean-code/` - Clean coding principles with practical examples
- `5-docker/` - Docker containerization and PostgreSQL setup
- `6-nestjs-basic/` - NestJS framework introduction and architecture

Each module contains:
- Reflection markdown files documenting learning outcomes
- Code examples demonstrating concepts
- Screenshots showing implementation proof
- Practice exercises and implementations

## Architecture Notes

### Learning Documentation Pattern
Each learning module follows a consistent structure:
- **Reflection files** (`.md`) answer specific questions about the learned concepts
- **Code examples** demonstrate practical implementation
- **Images/** directories contain screenshots as proof of work
- **Student-like explanations** use conversational tone with analogies

### Code Quality Setup
- ESLint configured with Airbnb style guide
- Jest for unit testing
- Prettier for code formatting
- React plugin enabled for JSX files

### Git Workflow
Repository uses standard Git workflow with:
- Main branch as primary development branch
- GitHub Issues for tracking learning tasks
- Milestones organizing related learning objectives
- Commit messages ending with Claude Code attribution

## Working with Issues

GitHub Issues represent learning tasks with:
- Structured task sections with checkboxes
- Reflection questions requiring written responses
- Requirements for screenshots as proof of implementation
- Milestone organization by learning domain
- each issue should be create folder by issue name inside milestone folder
- Mention where to puth what's screenshot
- create demo nestjs project if not exist in and create example code if requires some example
- demo project should only one for all issues

When working on issues, create the reflection markdown file specified in the issue description and ensure all task requirements are completed before marking as done. I need you to act as a student and explain a technical concept in a way that sounds natural, not like an AI. Your tone should be similar to how a student would talk about what they've learned after class. Do not use overly complex or formal language. Avoid typical AI-generated phrases like "in conclusion," "in this article," "it is important to note," or "delve into." Use a conversational tone with relatable analogies. Structure your answer in a clear, easy-to-read way. Make sure your explanation is easy enough for someone in 7th grade to understand. Should answer only reflection questions based on task completion results. 


