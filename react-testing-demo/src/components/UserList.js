/**
 * UserList component for demonstrating API mocking in tests
 * Fetches and displays a list of users from an API
 */

const React = require('react');
const { useState, useEffect } = React;
const userApi = require('../services/userApi');

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userApi.getUsers();
      
      if (response.ok) {
        setUsers(response.data);
      } else {
        setError(response.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      const response = await userApi.updateUserStatus(userId, newStatus);
      
      if (response.ok) {
        // Update the user in local state
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId ? { ...user, status: newStatus } : user
          )
        );
      } else {
        setError(response.error || 'Failed to update user status');
      }
    } catch (err) {
      setError('Failed to update user status');
    }
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  // Loading state
  if (loading) {
    return React.createElement(
      'div',
      { 'data-testid': 'user-list-loading' },
      React.createElement('p', null, 'Loading users...')
    );
  }

  // Error state
  if (error) {
    return React.createElement(
      'div',
      { 'data-testid': 'user-list-error' },
      React.createElement('p', { style: { color: 'red' } }, `Error: ${error}`),
      React.createElement(
        'button',
        {
          onClick: handleRefresh,
          'data-testid': 'retry-button'
        },
        'Retry'
      )
    );
  }

  // Empty state
  if (users.length === 0) {
    return React.createElement(
      'div',
      { 'data-testid': 'user-list-empty' },
      React.createElement('p', null, 'No users found'),
      React.createElement(
        'button',
        {
          onClick: handleRefresh,
          'data-testid': 'refresh-button'
        },
        'Refresh'
      )
    );
  }

  // Success state with users
  return React.createElement(
    'div',
    { 'data-testid': 'user-list' },
    React.createElement(
      'div',
      { style: { marginBottom: '16px' } },
      React.createElement('h2', null, 'Users'),
      React.createElement(
        'button',
        {
          onClick: handleRefresh,
          'data-testid': 'refresh-button'
        },
        'Refresh'
      )
    ),
    React.createElement(
      'div',
      { 'data-testid': 'users-container' },
      users.map(user =>
        React.createElement(
          'div',
          {
            key: user.id,
            'data-testid': `user-item-${user.id}`,
            style: {
              border: '1px solid #ccc',
              padding: '12px',
              margin: '8px 0',
              borderRadius: '4px',
              backgroundColor: selectedUserId === user.id ? '#f0f8ff' : '#fff'
            },
            onClick: () => setSelectedUserId(selectedUserId === user.id ? null : user.id)
          },
          React.createElement(
            'div',
            { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
            React.createElement(
              'div',
              null,
              React.createElement(
                'h3',
                { 'data-testid': `user-name-${user.id}` },
                user.name
              ),
              React.createElement(
                'p',
                { 'data-testid': `user-email-${user.id}` },
                user.email
              ),
              React.createElement(
                'span',
                {
                  'data-testid': `user-status-${user.id}`,
                  style: {
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    backgroundColor: user.status === 'active' ? '#d4edda' : '#f8d7da',
                    color: user.status === 'active' ? '#155724' : '#721c24'
                  }
                },
                user.status
              )
            ),
            React.createElement(
              'button',
              {
                onClick: (e) => {
                  e.stopPropagation();
                  handleUserStatusToggle(user.id, user.status);
                },
                'data-testid': `toggle-status-${user.id}`
              },
              user.status === 'active' ? 'Deactivate' : 'Activate'
            )
          )
        )
      )
    ),
    selectedUserId && React.createElement(
      'div',
      { 
        'data-testid': 'user-details',
        style: { marginTop: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '4px' }
      },
      React.createElement('h4', null, 'Selected User Details:'),
      React.createElement('p', null, `User ID: ${selectedUserId}`)
    )
  );
}

module.exports = UserList;