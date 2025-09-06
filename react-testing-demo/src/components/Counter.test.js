/**
 * Unit tests for Counter component with user interaction testing
 */

const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');
const userEvent = require('@testing-library/user-event').default;
const Counter = require('./Counter');

describe('Counter Component', () => {
  describe('Initial Rendering', () => {
    test('should render with default initial value', () => {
      render(React.createElement(Counter));
      
      expect(screen.getByTestId('counter-component')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Counter');
      expect(screen.getByTestId('count-display')).toHaveTextContent('Current count: 0');
    });

    test('should render with custom initial value', () => {
      render(React.createElement(Counter, { initialValue: 10 }));
      
      expect(screen.getByTestId('count-display')).toHaveTextContent('Current count: 10');
    });

    test('should render with custom step value', () => {
      render(React.createElement(Counter, { step: 5 }));
      
      expect(screen.getByTestId('increment-button')).toHaveTextContent('+5');
      expect(screen.getByTestId('decrement-button')).toHaveTextContent('-5');
    });

    test('should render all required buttons', () => {
      render(React.createElement(Counter));
      
      expect(screen.getByTestId('increment-button')).toBeInTheDocument();
      expect(screen.getByTestId('decrement-button')).toBeInTheDocument();
      expect(screen.getByTestId('reset-button')).toBeInTheDocument();
    });
  });

  describe('User Interactions with fireEvent', () => {
    test('should increment count when increment button is clicked', () => {
      render(React.createElement(Counter));
      
      const incrementButton = screen.getByTestId('increment-button');
      const countDisplay = screen.getByTestId('count-display');
      
      expect(countDisplay).toHaveTextContent('Current count: 0');
      
      fireEvent.click(incrementButton);
      expect(countDisplay).toHaveTextContent('Current count: 1');
      
      fireEvent.click(incrementButton);
      expect(countDisplay).toHaveTextContent('Current count: 2');
    });

    test('should decrement count when decrement button is clicked', () => {
      render(React.createElement(Counter, { initialValue: 5 }));
      
      const decrementButton = screen.getByTestId('decrement-button');
      const countDisplay = screen.getByTestId('count-display');
      
      expect(countDisplay).toHaveTextContent('Current count: 5');
      
      fireEvent.click(decrementButton);
      expect(countDisplay).toHaveTextContent('Current count: 4');
      
      fireEvent.click(decrementButton);
      expect(countDisplay).toHaveTextContent('Current count: 3');
    });

    test('should reset count to initial value when reset button is clicked', () => {
      render(React.createElement(Counter, { initialValue: 10 }));
      
      const incrementButton = screen.getByTestId('increment-button');
      const resetButton = screen.getByTestId('reset-button');
      const countDisplay = screen.getByTestId('count-display');
      
      expect(countDisplay).toHaveTextContent('Current count: 10');
      
      // Change the count
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      expect(countDisplay).toHaveTextContent('Current count: 12');
      
      // Reset should bring it back to initial value
      fireEvent.click(resetButton);
      expect(countDisplay).toHaveTextContent('Current count: 10');
    });
  });

  describe('User Interactions with userEvent', () => {
    test('should increment count when increment button is clicked with userEvent', async () => {
      const user = userEvent.setup();
      render(React.createElement(Counter));
      
      const incrementButton = screen.getByTestId('increment-button');
      const countDisplay = screen.getByTestId('count-display');
      
      expect(countDisplay).toHaveTextContent('Current count: 0');
      
      await user.click(incrementButton);
      expect(countDisplay).toHaveTextContent('Current count: 1');
      
      await user.click(incrementButton);
      expect(countDisplay).toHaveTextContent('Current count: 2');
    });

    test('should handle rapid clicking', async () => {
      const user = userEvent.setup();
      render(React.createElement(Counter));
      
      const incrementButton = screen.getByTestId('increment-button');
      const countDisplay = screen.getByTestId('count-display');
      
      expect(countDisplay).toHaveTextContent('Current count: 0');
      
      // Multiple rapid clicks
      await user.click(incrementButton);
      await user.click(incrementButton);
      await user.click(incrementButton);
      
      expect(countDisplay).toHaveTextContent('Current count: 3');
    });
  });

  describe('Custom Step Values', () => {
    test('should increment by custom step value', () => {
      render(React.createElement(Counter, { step: 3 }));
      
      const incrementButton = screen.getByTestId('increment-button');
      const countDisplay = screen.getByTestId('count-display');
      
      expect(countDisplay).toHaveTextContent('Current count: 0');
      
      fireEvent.click(incrementButton);
      expect(countDisplay).toHaveTextContent('Current count: 3');
      
      fireEvent.click(incrementButton);
      expect(countDisplay).toHaveTextContent('Current count: 6');
    });

    test('should decrement by custom step value', () => {
      render(React.createElement(Counter, { initialValue: 10, step: 4 }));
      
      const decrementButton = screen.getByTestId('decrement-button');
      const countDisplay = screen.getByTestId('count-display');
      
      expect(countDisplay).toHaveTextContent('Current count: 10');
      
      fireEvent.click(decrementButton);
      expect(countDisplay).toHaveTextContent('Current count: 6');
      
      fireEvent.click(decrementButton);
      expect(countDisplay).toHaveTextContent('Current count: 2');
    });
  });

  describe('Edge Cases', () => {
    test('should handle negative initial values', () => {
      render(React.createElement(Counter, { initialValue: -5 }));
      
      expect(screen.getByTestId('count-display')).toHaveTextContent('Current count: -5');
    });

    test('should go into negative numbers when decrementing from zero', () => {
      render(React.createElement(Counter));
      
      const decrementButton = screen.getByTestId('decrement-button');
      const countDisplay = screen.getByTestId('count-display');
      
      expect(countDisplay).toHaveTextContent('Current count: 0');
      
      fireEvent.click(decrementButton);
      expect(countDisplay).toHaveTextContent('Current count: -1');
      
      fireEvent.click(decrementButton);
      expect(countDisplay).toHaveTextContent('Current count: -2');
    });

    test('should handle zero step value', () => {
      render(React.createElement(Counter, { step: 0 }));
      
      const incrementButton = screen.getByTestId('increment-button');
      const countDisplay = screen.getByTestId('count-display');
      
      expect(countDisplay).toHaveTextContent('Current count: 0');
      
      fireEvent.click(incrementButton);
      expect(countDisplay).toHaveTextContent('Current count: 0');
    });

    test('should handle decimal step values', () => {
      render(React.createElement(Counter, { step: 0.5 }));
      
      const incrementButton = screen.getByTestId('increment-button');
      const countDisplay = screen.getByTestId('count-display');
      
      expect(countDisplay).toHaveTextContent('Current count: 0');
      
      fireEvent.click(incrementButton);
      expect(countDisplay).toHaveTextContent('Current count: 0.5');
      
      fireEvent.click(incrementButton);
      expect(countDisplay).toHaveTextContent('Current count: 1');
    });
  });

  describe('Multiple Operations', () => {
    test('should handle combination of increment, decrement, and reset operations', () => {
      render(React.createElement(Counter, { initialValue: 5, step: 2 }));
      
      const incrementButton = screen.getByTestId('increment-button');
      const decrementButton = screen.getByTestId('decrement-button');
      const resetButton = screen.getByTestId('reset-button');
      const countDisplay = screen.getByTestId('count-display');
      
      expect(countDisplay).toHaveTextContent('Current count: 5');
      
      // Increment twice
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      expect(countDisplay).toHaveTextContent('Current count: 9');
      
      // Decrement once
      fireEvent.click(decrementButton);
      expect(countDisplay).toHaveTextContent('Current count: 7');
      
      // Increment once more
      fireEvent.click(incrementButton);
      expect(countDisplay).toHaveTextContent('Current count: 9');
      
      // Reset should bring back to initial value
      fireEvent.click(resetButton);
      expect(countDisplay).toHaveTextContent('Current count: 5');
    });
  });
});