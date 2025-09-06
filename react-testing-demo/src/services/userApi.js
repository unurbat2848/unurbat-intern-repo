/**
 * User API service for demonstration of API mocking
 * Simulates a real API that fetches user data
 */

// Simulate a fake API endpoint
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Mock user data structure
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'inactive' }
];

const userApi = {
  // Fetch all users
  async getUsers() {
    try {
      // In a real app, this would be: fetch(`${API_BASE_URL}/users`)
      // For demo purposes, we'll simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Simulate potential network error
      if (Math.random() > 0.9) {
        throw new Error('Network error');
      }
      
      return {
        ok: true,
        data: mockUsers,
        status: 200
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
        status: 500
      };
    }
  },

  // Fetch a single user by ID
  async getUserById(id) {
    try {
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const user = mockUsers.find(u => u.id === id);
      
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
          status: 404
        };
      }
      
      return {
        ok: true,
        data: user,
        status: 200
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
        status: 500
      };
    }
  },

  // Create a new user
  async createUser(userData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Validate required fields
      if (!userData.name || !userData.email) {
        return {
          ok: false,
          error: 'Name and email are required',
          status: 400
        };
      }
      
      const newUser = {
        id: mockUsers.length + 1,
        ...userData,
        status: 'active'
      };
      
      return {
        ok: true,
        data: newUser,
        status: 201
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
        status: 500
      };
    }
  },

  // Update user status
  async updateUserStatus(id, status) {
    try {
      await new Promise(resolve => setTimeout(resolve, 75));
      
      const user = mockUsers.find(u => u.id === id);
      
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
          status: 404
        };
      }
      
      const updatedUser = { ...user, status };
      
      return {
        ok: true,
        data: updatedUser,
        status: 200
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
        status: 500
      };
    }
  }
};

module.exports = userApi;