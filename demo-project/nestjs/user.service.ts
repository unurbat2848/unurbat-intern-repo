import { Injectable } from '@nestjs/common';

// This is a basic service with @Injectable() decorator
@Injectable()
export class UserService {
  private users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' }
  ];

  // Get all users
  getAllUsers() {
    return this.users;
  }

  // Find user by ID
  findUserById(id: number) {
    return this.users.find(user => user.id === id);
  }

  // Add new user
  createUser(name: string, email: string) {
    const newUser = {
      id: this.users.length + 1,
      name,
      email
    };
    this.users.push(newUser);
    return newUser;
  }
}