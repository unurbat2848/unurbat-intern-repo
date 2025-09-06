/**
 * Simple MessageDisplay component for demonstrating React Testing Library
 * This component shows a message and allows user to toggle between different messages
 */

const React = require('react');
const { useState } = React;

function MessageDisplay({ initialMessage = 'Hello, Testing World!' }) {
  const [message, setMessage] = useState(initialMessage);
  const [isToggled, setIsToggled] = useState(false);

  const toggleMessage = () => {
    if (isToggled) {
      setMessage(initialMessage);
    } else {
      setMessage('Message has been changed!');
    }
    setIsToggled(!isToggled);
  };

  return React.createElement(
    'div',
    { 'data-testid': 'message-display-component' },
    React.createElement(
      'h1',
      { 'data-testid': 'message-text' },
      message
    ),
    React.createElement(
      'p',
      null,
      'Click the button below to toggle the message:'
    ),
    React.createElement(
      'button',
      {
        onClick: toggleMessage,
        'data-testid': 'toggle-message-button'
      },
      isToggled ? 'Show Original Message' : 'Show New Message'
    ),
    React.createElement(
      'p',
      { 'data-testid': 'button-state' },
      `Button state: ${isToggled ? 'toggled' : 'original'}`
    )
  );
}

module.exports = MessageDisplay;