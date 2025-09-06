/**
 * Unit tests for UserList component demonstrating API mocking techniques
 * Shows different ways to mock API calls using jest.fn() and jest.mock()
 */

const React = require('react');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const userEvent = require('@testing-library/user-event').default;

// Import the component and API service
const UserList = require('./UserList');

// Mock the entire userApi module
jest.mock('../services/userApi');
const userApi = require('../services/userApi');

// Mock data for testing
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' }
];

const mockApiResponse = {
  ok: true,
  data: mockUsers,
  status: 200
};

const mockErrorResponse = {
  ok: false,
  error: 'Failed to fetch users',
  status: 500
};

describe('UserList Component - API Mocking', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Loading and Success States', () => {
    test('should show loading state initially then display users', async () => {
      // Mock successful API call
      userApi.getUsers.mockResolvedValue(mockApiResponse);

      render(React.createElement(UserList));

      // Check loading state appears first
      expect(screen.getByTestId('user-list-loading')).toBeInTheDocument();
      expect(screen.getByText('Loading users...')).toBeInTheDocument();

      // Wait for loading to finish and users to appear
      await waitFor(() => {
        expect(screen.queryByTestId('user-list-loading')).not.toBeInTheDocument();
      });

      // Check that users are displayed
      expect(screen.getByTestId('user-list')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();

      // Verify API was called
      expect(userApi.getUsers).toHaveBeenCalledTimes(1);
    });

    test('should display user status correctly', async () => {
      userApi.getUsers.mockResolvedValue(mockApiResponse);

      render(React.createElement(UserList));

      await waitFor(() => {
        expect(screen.getByTestId('user-status-1')).toBeInTheDocument();
      });

      // Check status badges
      expect(screen.getByTestId('user-status-1')).toHaveTextContent('active');
      expect(screen.getByTestId('user-status-2')).toHaveTextContent('inactive');

      // Check toggle buttons
      expect(screen.getByTestId('toggle-status-1')).toHaveTextContent('Deactivate');
      expect(screen.getByTestId('toggle-status-2')).toHaveTextContent('Activate');
    });
  });

  describe('Error Handling', () => {
    test('should display error message when API call fails', async () => {
      // Mock API failure
      userApi.getUsers.mockResolvedValue(mockErrorResponse);

      render(React.createElement(UserList));

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByTestId('user-list-error')).toBeInTheDocument();
      });

      expect(screen.getByText('Error: Failed to fetch users')).toBeInTheDocument();
      expect(screen.getByTestId('retry-button')).toBeInTheDocument();

      // Verify API was called
      expect(userApi.getUsers).toHaveBeenCalledTimes(1);
    });

    test('should display error when API throws exception', async () => {
      // Mock API throwing an exception
      userApi.getUsers.mockRejectedValue(new Error('Network error'));

      render(React.createElement(UserList));

      await waitFor(() => {
        expect(screen.getByTestId('user-list-error')).toBeInTheDocument();
      });

      expect(screen.getByText('Error: Network error occurred')).toBeInTheDocument();
    });

    test('should retry API call when retry button is clicked', async () => {
      // First call fails, second call succeeds
      userApi.getUsers
        .mockResolvedValueOnce(mockErrorResponse)
        .mockResolvedValueOnce(mockApiResponse);

      const user = userEvent.setup();
      render(React.createElement(UserList));

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByTestId('user-list-error')).toBeInTheDocument();
      });

      // Click retry button
      await user.click(screen.getByTestId('retry-button'));

      // Wait for success state
      await waitFor(() => {
        expect(screen.getByTestId('user-list')).toBeInTheDocument();
      });

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(userApi.getUsers).toHaveBeenCalledTimes(2);
    });
  });

  describe('Empty State', () => {
    test('should display empty state when no users are returned', async () => {
      // Mock empty response
      const emptyResponse = { ok: true, data: [], status: 200 };
      userApi.getUsers.mockResolvedValue(emptyResponse);

      render(React.createElement(UserList));

      await waitFor(() => {
        expect(screen.getByTestId('user-list-empty')).toBeInTheDocument();
      });

      expect(screen.getByText('No users found')).toBeInTheDocument();
      expect(screen.getByTestId('refresh-button')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    test('should refresh users when refresh button is clicked', async () => {
      userApi.getUsers.mockResolvedValue(mockApiResponse);

      const user = userEvent.setup();
      render(React.createElement(UserList));

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId('user-list')).toBeInTheDocument();
      });

      // Click refresh button
      await user.click(screen.getByTestId('refresh-button'));

      // Verify API was called twice (initial + refresh)
      expect(userApi.getUsers).toHaveBeenCalledTimes(2);
    });

    test('should select user when clicked', async () => {
      userApi.getUsers.mockResolvedValue(mockApiResponse);

      const user = userEvent.setup();
      render(React.createElement(UserList));

      await waitFor(() => {
        expect(screen.getByTestId('user-item-1')).toBeInTheDocument();
      });

      // Click on first user
      await user.click(screen.getByTestId('user-item-1'));

      // Check that user details are shown
      expect(screen.getByTestId('user-details')).toBeInTheDocument();
      expect(screen.getByText('User ID: 1')).toBeInTheDocument();

      // Click again to deselect
      await user.click(screen.getByTestId('user-item-1'));

      // User details should be hidden
      expect(screen.queryByTestId('user-details')).not.toBeInTheDocument();
    });

    test('should toggle user status when toggle button is clicked', async () => {
      userApi.getUsers.mockResolvedValue(mockApiResponse);
      userApi.updateUserStatus.mockResolvedValue({
        ok: true,
        data: { ...mockUsers[0], status: 'inactive' },
        status: 200
      });

      const user = userEvent.setup();
      render(React.createElement(UserList));

      await waitFor(() => {
        expect(screen.getByTestId('toggle-status-1')).toBeInTheDocument();
      });

      // Click toggle button for first user
      await user.click(screen.getByTestId('toggle-status-1'));

      // Verify API was called with correct parameters
      expect(userApi.updateUserStatus).toHaveBeenCalledWith(1, 'inactive');

      // Wait for UI to update
      await waitFor(() => {
        expect(screen.getByTestId('user-status-1')).toHaveTextContent('inactive');
      });

      expect(screen.getByTestId('toggle-status-1')).toHaveTextContent('Activate');
    });

    test('should handle status update failure gracefully', async () => {
      userApi.getUsers.mockResolvedValue(mockApiResponse);
      userApi.updateUserStatus.mockResolvedValue({
        ok: false,
        error: 'Update failed',
        status: 500
      });

      const user = userEvent.setup();
      render(React.createElement(UserList));

      await waitFor(() => {
        expect(screen.getByTestId('toggle-status-1')).toBeInTheDocument();
      });

      // Click toggle button
      await user.click(screen.getByTestId('toggle-status-1'));

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByTestId('user-list-error')).toBeInTheDocument();
      });

      expect(screen.getByText('Error: Update failed')).toBeInTheDocument();
    });
  });

  describe('Advanced Mocking Scenarios', () => {
    test('should handle multiple API calls with different responses', async () => {
      // Mock different responses for different calls
      userApi.getUsers
        .mockResolvedValueOnce(mockApiResponse)
        .mockResolvedValueOnce({
          ok: true,
          data: [{ id: 3, name: 'New User', email: 'new@example.com', status: 'active' }],
          status: 200
        });

      const user = userEvent.setup();
      render(React.createElement(UserList));

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Refresh to get second response
      await user.click(screen.getByTestId('refresh-button'));

      await waitFor(() => {
        expect(screen.getByText('New User')).toBeInTheDocument();
      });

      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    test('should verify API call arguments', async () => {
      userApi.getUsers.mockResolvedValue(mockApiResponse);
      userApi.updateUserStatus.mockResolvedValue({
        ok: true,
        data: mockUsers[1],
        status: 200
      });

      const user = userEvent.setup();
      render(React.createElement(UserList));

      await waitFor(() => {
        expect(screen.getByTestId('toggle-status-2')).toBeInTheDocument();
      });

      // Toggle inactive user to active
      await user.click(screen.getByTestId('toggle-status-2'));

      // Verify the exact arguments passed to API
      expect(userApi.updateUserStatus).toHaveBeenCalledWith(2, 'active');
      expect(userApi.updateUserStatus).toHaveBeenCalledTimes(1);
    });

    test('should handle API timing and race conditions', async () => {
      let resolvePromise;
      const slowApiCall = new Promise(resolve => {
        resolvePromise = resolve;
      });

      userApi.getUsers.mockReturnValue(slowApiCall);

      render(React.createElement(UserList));

      // Loading should be shown immediately
      expect(screen.getByTestId('user-list-loading')).toBeInTheDocument();

      // Resolve the promise
      resolvePromise(mockApiResponse);

      // Wait for the component to update
      await waitFor(() => {
        expect(screen.getByTestId('user-list')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('user-list-loading')).not.toBeInTheDocument();
    });
  });

  describe('Mock Verification', () => {
    test('should verify mock functions were called correctly', async () => {
      userApi.getUsers.mockResolvedValue(mockApiResponse);

      render(React.createElement(UserList));

      await waitFor(() => {
        expect(screen.getByTestId('user-list')).toBeInTheDocument();
      });

      // Verify mock was called
      expect(userApi.getUsers).toHaveBeenCalled();
      expect(userApi.getUsers).toHaveBeenCalledTimes(1);
      expect(userApi.getUsers).toHaveBeenCalledWith(); // No arguments

      // Verify mock implementation
      expect(userApi.getUsers).toHaveReturnedWith(Promise.resolve(mockApiResponse));
    });

    test('should reset mocks between tests', async () => {
      // This test verifies that mocks are properly reset
      expect(userApi.getUsers).not.toHaveBeenCalled();
      expect(userApi.updateUserStatus).not.toHaveBeenCalled();

      userApi.getUsers.mockResolvedValue(mockApiResponse);
      render(React.createElement(UserList));

      await waitFor(() => {
        expect(userApi.getUsers).toHaveBeenCalledTimes(1);
      });
    });
  });
});