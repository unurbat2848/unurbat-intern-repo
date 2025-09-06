/**
 * Contact Form component for demonstrating form testing with React Testing Library
 */

const React = require('react');
const { useState } = React;

function ContactForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setSubmitted(true);
    setErrors({});
    
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  if (submitted) {
    return React.createElement(
      'div',
      { 'data-testid': 'success-message' },
      React.createElement('h3', null, 'Thank you!'),
      React.createElement('p', null, 'Your message has been sent successfully.')
    );
  }

  return React.createElement(
    'form',
    {
      onSubmit: handleSubmit,
      'data-testid': 'contact-form'
    },
    React.createElement('h2', null, 'Contact Us'),
    
    React.createElement(
      'div',
      null,
      React.createElement(
        'label',
        { htmlFor: 'name' },
        'Name:'
      ),
      React.createElement('input', {
        type: 'text',
        id: 'name',
        name: 'name',
        value: formData.name,
        onChange: handleChange,
        'data-testid': 'name-input'
      }),
      errors.name && React.createElement(
        'span',
        { 'data-testid': 'name-error', style: { color: 'red' } },
        errors.name
      )
    ),
    
    React.createElement(
      'div',
      null,
      React.createElement(
        'label',
        { htmlFor: 'email' },
        'Email:'
      ),
      React.createElement('input', {
        type: 'email',
        id: 'email',
        name: 'email',
        value: formData.email,
        onChange: handleChange,
        'data-testid': 'email-input'
      }),
      errors.email && React.createElement(
        'span',
        { 'data-testid': 'email-error', style: { color: 'red' } },
        errors.email
      )
    ),
    
    React.createElement(
      'div',
      null,
      React.createElement(
        'label',
        { htmlFor: 'message' },
        'Message:'
      ),
      React.createElement('textarea', {
        id: 'message',
        name: 'message',
        value: formData.message,
        onChange: handleChange,
        'data-testid': 'message-input',
        rows: 4
      }),
      errors.message && React.createElement(
        'span',
        { 'data-testid': 'message-error', style: { color: 'red' } },
        errors.message
      )
    ),
    
    React.createElement(
      'button',
      {
        type: 'submit',
        'data-testid': 'submit-button'
      },
      'Send Message'
    )
  );
}

module.exports = ContactForm;