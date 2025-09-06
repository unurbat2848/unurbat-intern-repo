/**
 * Interactive Counter component for demonstrating user interaction testing
 */

const React = require('react');
const { useState } = React;

function Counter({ initialValue = 0, step = 1 }) {
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    setCount(prevCount => prevCount + step);
  };

  const decrement = () => {
    setCount(prevCount => prevCount - step);
  };

  const reset = () => {
    setCount(initialValue);
  };

  return React.createElement(
    'div',
    { 'data-testid': 'counter-component' },
    React.createElement(
      'h2',
      null,
      'Counter'
    ),
    React.createElement(
      'p',
      { 'data-testid': 'count-display' },
      `Current count: ${count}`
    ),
    React.createElement(
      'div',
      null,
      React.createElement(
        'button',
        {
          onClick: increment,
          'data-testid': 'increment-button'
        },
        `+${step}`
      ),
      React.createElement(
        'button',
        {
          onClick: decrement,
          'data-testid': 'decrement-button'
        },
        `-${step}`
      ),
      React.createElement(
        'button',
        {
          onClick: reset,
          'data-testid': 'reset-button'
        },
        'Reset'
      )
    )
  );
}

module.exports = Counter;