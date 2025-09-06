/**
 * Unit tests for MessageDisplay component using React Testing Library
 * Demonstrates both rendering tests and user interaction testing
 */

const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');
const userEvent = require('@testing-library/user-event').default;
const MessageDisplay = require('./MessageDisplay');

describe('MessageDisplay Component', () => {
  describe('Initial Rendering Tests', () => {
    test('should render with default message', () => {
      render(React.createElement(MessageDisplay));
      
      // Check that the component renders
      expect(screen.getByTestId('message-display-component')).toBeInTheDocument();
      
      // Check the default message is displayed
      expect(screen.getByTestId('message-text')).toHaveTextContent('Hello, Testing World!');
      
      // Check that instructions are present
      expect(screen.getByText('Click the button below to toggle the message:')).toBeInTheDocument();
      
      // Check that the button is present with correct initial text
      expect(screen.getByTestId('toggle-message-button')).toHaveTextContent('Show New Message');
      
      // Check initial button state
      expect(screen.getByTestId('button-state')).toHaveTextContent('Button state: original');
    });

    test('should render with custom initial message', () => {
      const customMessage = 'Custom Test Message';
      render(React.createElement(MessageDisplay, { initialMessage: customMessage }));
      
      expect(screen.getByTestId('message-text')).toHaveTextContent(customMessage);
      expect(screen.getByTestId('toggle-message-button')).toHaveTextContent('Show New Message');
    });

    test('should have proper accessibility structure', () => {
      render(React.createElement(MessageDisplay));
      
      // Check for heading
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Hello, Testing World!');
      
      // Check for button
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Show New Message');
    });
  });

  describe('User Interaction Tests with fireEvent', () => {
    test('should toggle message when button is clicked using fireEvent', () => {
      render(React.createElement(MessageDisplay));
      
      const messageText = screen.getByTestId('message-text');
      const toggleButton = screen.getByTestId('toggle-message-button');
      const buttonState = screen.getByTestId('button-state');
      
      // Initial state
      expect(messageText).toHaveTextContent('Hello, Testing World!');
      expect(toggleButton).toHaveTextContent('Show New Message');
      expect(buttonState).toHaveTextContent('Button state: original');
      
      // Click the button to toggle
      fireEvent.click(toggleButton);
      
      // Check that message changed
      expect(messageText).toHaveTextContent('Message has been changed!');
      expect(toggleButton).toHaveTextContent('Show Original Message');
      expect(buttonState).toHaveTextContent('Button state: toggled');
      
      // Click again to toggle back
      fireEvent.click(toggleButton);
      
      // Should return to original state
      expect(messageText).toHaveTextContent('Hello, Testing World!');
      expect(toggleButton).toHaveTextContent('Show New Message');
      expect(buttonState).toHaveTextContent('Button state: original');
    });

    test('should handle multiple rapid clicks', () => {
      render(React.createElement(MessageDisplay));
      
      const messageText = screen.getByTestId('message-text');
      const toggleButton = screen.getByTestId('toggle-message-button');
      
      // Click multiple times rapidly
      fireEvent.click(toggleButton);
      fireEvent.click(toggleButton);
      fireEvent.click(toggleButton);
      
      // Should be in toggled state (odd number of clicks)
      expect(messageText).toHaveTextContent('Message has been changed!');
      expect(toggleButton).toHaveTextContent('Show Original Message');
    });
  });

  describe('User Interaction Tests with userEvent', () => {
    test('should toggle message when button is clicked using userEvent', async () => {
      const user = userEvent.setup();
      render(React.createElement(MessageDisplay));
      
      const messageText = screen.getByTestId('message-text');
      const toggleButton = screen.getByTestId('toggle-message-button');
      
      // Initial state
      expect(messageText).toHaveTextContent('Hello, Testing World!');
      expect(toggleButton).toHaveTextContent('Show New Message');
      
      // Click using userEvent (more realistic)
      await user.click(toggleButton);
      
      // Check that message changed
      expect(messageText).toHaveTextContent('Message has been changed!');
      expect(toggleButton).toHaveTextContent('Show Original Message');
      
      // Click again
      await user.click(toggleButton);
      
      // Should return to original
      expect(messageText).toHaveTextContent('Hello, Testing World!');
      expect(toggleButton).toHaveTextContent('Show New Message');
    });

    test('should work with custom initial message and user interaction', async () => {
      const user = userEvent.setup();
      const customMessage = 'My Custom Message';
      
      render(React.createElement(MessageDisplay, { initialMessage: customMessage }));
      
      const messageText = screen.getByTestId('message-text');
      const toggleButton = screen.getByTestId('toggle-message-button');
      
      // Check custom initial message
      expect(messageText).toHaveTextContent(customMessage);
      
      // Toggle message
      await user.click(toggleButton);
      expect(messageText).toHaveTextContent('Message has been changed!');
      
      // Toggle back to custom message
      await user.click(toggleButton);
      expect(messageText).toHaveTextContent(customMessage);
    });
  });

  describe('Component State Management', () => {
    test('should maintain state consistency across interactions', () => {
      render(React.createElement(MessageDisplay));
      
      const messageText = screen.getByTestId('message-text');
      const toggleButton = screen.getByTestId('toggle-message-button');
      const buttonState = screen.getByTestId('button-state');
      
      // Test multiple state changes
      const states = [
        {
          message: 'Message has been changed!',
          buttonText: 'Show Original Message',
          stateText: 'Button state: toggled'
        },
        {
          message: 'Hello, Testing World!',
          buttonText: 'Show New Message',
          stateText: 'Button state: original'
        }
      ];
      
      // Test cycling through states
      for (let i = 0; i < 4; i++) {
        fireEvent.click(toggleButton);
        const expectedState = states[i % 2];
        
        expect(messageText).toHaveTextContent(expectedState.message);
        expect(toggleButton).toHaveTextContent(expectedState.buttonText);
        expect(buttonState).toHaveTextContent(expectedState.stateText);
      }
    });
  });

  describe('Props and Edge Cases', () => {
    test('should handle empty initial message', () => {
      render(React.createElement(MessageDisplay, { initialMessage: '' }));
      
      const messageText = screen.getByTestId('message-text');
      expect(messageText).toHaveTextContent('');
      
      // Should still toggle to the standard message
      fireEvent.click(screen.getByTestId('toggle-message-button'));
      expect(messageText).toHaveTextContent('Message has been changed!');
      
      // Toggle back to empty
      fireEvent.click(screen.getByTestId('toggle-message-button'));
      expect(messageText).toHaveTextContent('');
    });

    test('should handle very long initial message', () => {
      const longMessage = 'This is a very long message that tests how the component handles lengthy text content and whether it displays correctly without breaking the layout or functionality.';
      
      render(React.createElement(MessageDisplay, { initialMessage: longMessage }));
      
      expect(screen.getByTestId('message-text')).toHaveTextContent(longMessage);
      
      // Should still be able to toggle
      fireEvent.click(screen.getByTestId('toggle-message-button'));
      expect(screen.getByTestId('message-text')).toHaveTextContent('Message has been changed!');
    });
  });
});