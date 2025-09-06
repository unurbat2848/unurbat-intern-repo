/**
 * Unit tests for Welcome component using React Testing Library
 */

const React = require('react');
const { render, screen } = require('@testing-library/react');
const Welcome = require('./Welcome');

describe('Welcome Component', () => {
  describe('Rendering', () => {
    test('should render welcome message with default name', () => {
      render(React.createElement(Welcome));
      
      // Test that the component renders
      expect(screen.getByTestId('welcome-component')).toBeInTheDocument();
      
      // Test the default greeting
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello, World!');
      
      // Test the welcome message
      expect(screen.getByText('Welcome to our React Testing Library demo.')).toBeInTheDocument();
    });

    test('should render welcome message with custom name', () => {
      render(React.createElement(Welcome, { name: 'Alice' }));
      
      // Test that the custom name is displayed
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello, Alice!');
      
      // Test that the component structure is still there
      expect(screen.getByTestId('welcome-component')).toBeInTheDocument();
      expect(screen.getByText('Welcome to our React Testing Library demo.')).toBeInTheDocument();
    });

    test('should handle empty name gracefully', () => {
      render(React.createElement(Welcome, { name: '' }));
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello, !');
    });

    test('should handle special characters in name', () => {
      render(React.createElement(Welcome, { name: 'José María' }));
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello, José María!');
    });

    test('should handle very long names', () => {
      const longName = 'A'.repeat(100);
      render(React.createElement(Welcome, { name: longName }));
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(`Hello, ${longName}!`);
    });
  });

  describe('Accessibility', () => {
    test('should have proper heading structure', () => {
      render(React.createElement(Welcome, { name: 'Test User' }));
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Hello, Test User!');
    });

    test('should be findable by test id', () => {
      render(React.createElement(Welcome));
      
      expect(screen.getByTestId('welcome-component')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    test('should contain expected elements', () => {
      render(React.createElement(Welcome, { name: 'Test' }));
      
      // Check for main container
      const container = screen.getByTestId('welcome-component');
      expect(container).toBeInTheDocument();
      
      // Check for heading
      const heading = screen.getByRole('heading');
      expect(heading.tagName).toBe('H1');
      
      // Check for paragraph
      const paragraph = screen.getByText('Welcome to our React Testing Library demo.');
      expect(paragraph.tagName).toBe('P');
    });
  });

  describe('Props Handling', () => {
    test('should handle undefined name prop', () => {
      render(React.createElement(Welcome, { name: undefined }));
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello, World!');
    });

    test('should handle null name prop', () => {
      render(React.createElement(Welcome, { name: null }));
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello, !');
    });

    test('should handle numeric name prop', () => {
      render(React.createElement(Welcome, { name: 123 }));
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello, 123!');
    });
  });
});