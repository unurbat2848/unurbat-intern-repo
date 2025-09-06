/**
 * Unit tests for ContactForm component with form interaction testing
 */

const React = require('react');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const userEvent = require('@testing-library/user-event');
const ContactForm = require('./ContactForm');

describe('ContactForm Component', () => {
  describe('Initial Rendering', () => {
    test('should render form with all required fields', () => {
      render(React.createElement(ContactForm));
      
      expect(screen.getByTestId('contact-form')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Contact Us');
      
      // Check for form fields
      expect(screen.getByLabelText('Name:')).toBeInTheDocument();
      expect(screen.getByLabelText('Email:')).toBeInTheDocument();
      expect(screen.getByLabelText('Message:')).toBeInTheDocument();
      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });

    test('should have empty form fields initially', () => {
      render(React.createElement(ContactForm));
      
      expect(screen.getByTestId('name-input')).toHaveValue('');
      expect(screen.getByTestId('email-input')).toHaveValue('');
      expect(screen.getByTestId('message-input')).toHaveValue('');
    });

    test('should not show any error messages initially', () => {
      render(React.createElement(ContactForm));
      
      expect(screen.queryByTestId('name-error')).not.toBeInTheDocument();
      expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();
      expect(screen.queryByTestId('message-error')).not.toBeInTheDocument();
    });
  });

  describe('Form Input Interactions', () => {
    test('should update input values when user types', async () => {
      const user = userEvent.setup();
      render(React.createElement(ContactForm));
      
      const nameInput = screen.getByTestId('name-input');
      const emailInput = screen.getByTestId('email-input');
      const messageInput = screen.getByTestId('message-input');
      
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'Hello world!');
      
      expect(nameInput).toHaveValue('John Doe');
      expect(emailInput).toHaveValue('john@example.com');
      expect(messageInput).toHaveValue('Hello world!');
    });

    test('should handle special characters in inputs', async () => {
      const user = userEvent.setup();
      render(React.createElement(ContactForm));
      
      const nameInput = screen.getByTestId('name-input');
      const messageInput = screen.getByTestId('message-input');
      
      await user.type(nameInput, 'José María');
      await user.type(messageInput, 'Special chars: àáâãäåæçè!@#$%^&*()');
      
      expect(nameInput).toHaveValue('José María');
      expect(messageInput).toHaveValue('Special chars: àáâãäåæçè!@#$%^&*()');
    });
  });

  describe('Form Validation', () => {
    test('should show validation errors for empty required fields', async () => {
      const user = userEvent.setup();
      render(React.createElement(ContactForm));
      
      const submitButton = screen.getByTestId('submit-button');
      
      await user.click(submitButton);
      
      expect(screen.getByTestId('name-error')).toHaveTextContent('Name is required');
      expect(screen.getByTestId('email-error')).toHaveTextContent('Email is required');
      expect(screen.getByTestId('message-error')).toHaveTextContent('Message is required');
    });

    test('should show error for invalid email format', async () => {
      const user = userEvent.setup();
      render(React.createElement(ContactForm));
      
      const nameInput = screen.getByTestId('name-input');
      const emailInput = screen.getByTestId('email-input');
      const messageInput = screen.getByTestId('message-input');
      const submitButton = screen.getByTestId('submit-button');
      
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'invalid-email');
      await user.type(messageInput, 'Hello world');
      await user.click(submitButton);
      
      expect(screen.getByTestId('email-error')).toHaveTextContent('Email is invalid');
      expect(screen.queryByTestId('name-error')).not.toBeInTheDocument();
      expect(screen.queryByTestId('message-error')).not.toBeInTheDocument();
    });

    test('should clear error when user starts typing in field', async () => {
      const user = userEvent.setup();
      render(React.createElement(ContactForm));
      
      const nameInput = screen.getByTestId('name-input');
      const submitButton = screen.getByTestId('submit-button');
      
      // Trigger validation error
      await user.click(submitButton);
      expect(screen.getByTestId('name-error')).toBeInTheDocument();
      
      // Start typing to clear error
      await user.type(nameInput, 'J');
      expect(screen.queryByTestId('name-error')).not.toBeInTheDocument();
    });

    test('should validate email formats correctly', async () => {
      const user = userEvent.setup();
      render(React.createElement(ContactForm));
      
      const nameInput = screen.getByTestId('name-input');
      const emailInput = screen.getByTestId('email-input');
      const messageInput = screen.getByTestId('message-input');
      const submitButton = screen.getByTestId('submit-button');
      
      await user.type(nameInput, 'Test User');
      await user.type(messageInput, 'Test message');
      
      // Test various invalid email formats
      const invalidEmails = ['invalid', '@domain.com', 'user@', 'user@domain', 'user.domain.com'];
      
      for (const email of invalidEmails) {
        await user.clear(emailInput);
        await user.type(emailInput, email);
        await user.click(submitButton);
        
        expect(screen.getByTestId('email-error')).toHaveTextContent('Email is invalid');
      }
      
      // Test valid email
      await user.clear(emailInput);
      await user.type(emailInput, 'valid@example.com');
      await user.click(submitButton);
      
      expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    test('should call onSubmit callback with form data when valid', async () => {
      const mockOnSubmit = jest.fn();
      const user = userEvent.setup();
      
      render(React.createElement(ContactForm, { onSubmit: mockOnSubmit }));
      
      const nameInput = screen.getByTestId('name-input');
      const emailInput = screen.getByTestId('email-input');
      const messageInput = screen.getByTestId('message-input');
      const submitButton = screen.getByTestId('submit-button');
      
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'Hello world!');
      await user.click(submitButton);
      
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello world!'
      });
    });

    test('should show success message after successful submission', async () => {
      const user = userEvent.setup();
      render(React.createElement(ContactForm));
      
      const nameInput = screen.getByTestId('name-input');
      const emailInput = screen.getByTestId('email-input');
      const messageInput = screen.getByTestId('message-input');
      const submitButton = screen.getByTestId('submit-button');
      
      await user.type(nameInput, 'Jane Doe');
      await user.type(emailInput, 'jane@example.com');
      await user.type(messageInput, 'Thanks for the demo!');
      await user.click(submitButton);
      
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
      expect(screen.getByText('Thank you!')).toBeInTheDocument();
      expect(screen.getByText('Your message has been sent successfully.')).toBeInTheDocument();
      
      // Form should be hidden
      expect(screen.queryByTestId('contact-form')).not.toBeInTheDocument();
    });

    test('should not submit form with validation errors', async () => {
      const mockOnSubmit = jest.fn();
      const user = userEvent.setup();
      
      render(React.createElement(ContactForm, { onSubmit: mockOnSubmit }));
      
      const submitButton = screen.getByTestId('submit-button');
      
      await user.click(submitButton);
      
      expect(mockOnSubmit).not.toHaveBeenCalled();
      expect(screen.queryByTestId('success-message')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('should handle form submission without onSubmit callback', async () => {
      const user = userEvent.setup();
      render(React.createElement(ContactForm));
      
      const nameInput = screen.getByTestId('name-input');
      const emailInput = screen.getByTestId('email-input');
      const messageInput = screen.getByTestId('message-input');
      const submitButton = screen.getByTestId('submit-button');
      
      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'test@example.com');
      await user.type(messageInput, 'Test message');
      
      // Should not throw error
      await user.click(submitButton);
      
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });

    test('should handle whitespace-only inputs as invalid', async () => {
      const user = userEvent.setup();
      render(React.createElement(ContactForm));
      
      const nameInput = screen.getByTestId('name-input');
      const emailInput = screen.getByTestId('email-input');
      const messageInput = screen.getByTestId('message-input');
      const submitButton = screen.getByTestId('submit-button');
      
      await user.type(nameInput, '   ');
      await user.type(emailInput, '  test@example.com  ');
      await user.type(messageInput, '\t\n  ');
      await user.click(submitButton);
      
      expect(screen.getByTestId('name-error')).toHaveTextContent('Name is required');
      expect(screen.getByTestId('message-error')).toHaveTextContent('Message is required');
      expect(screen.queryByTestId('email-error')).not.toBeInTheDocument(); // Email has valid content after trim
    });
  });

  describe('Accessibility', () => {
    test('should have proper form labels', () => {
      render(React.createElement(ContactForm));
      
      expect(screen.getByLabelText('Name:')).toBeInTheDocument();
      expect(screen.getByLabelText('Email:')).toBeInTheDocument();
      expect(screen.getByLabelText('Message:')).toBeInTheDocument();
    });

    test('should have proper form structure', () => {
      render(React.createElement(ContactForm));
      
      const form = screen.getByTestId('contact-form');
      expect(form.tagName).toBe('FORM');
      
      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });
});