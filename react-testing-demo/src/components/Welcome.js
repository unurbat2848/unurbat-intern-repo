/**
 * Simple Welcome component for demonstrating React Testing Library
 */

const React = require('react');

function Welcome({ name = 'World' }) {
  return React.createElement(
    'div',
    { 'data-testid': 'welcome-component' },
    React.createElement('h1', null, `Hello, ${name}!`),
    React.createElement(
      'p',
      null,
      'Welcome to our React Testing Library demo.'
    )
  );
}

module.exports = Welcome;