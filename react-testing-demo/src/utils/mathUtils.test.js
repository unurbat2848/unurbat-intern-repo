/**
 * Unit tests for mathUtils functions using Jest
 */

const {
  add,
  subtract,
  multiply,
  divide,
  isEven,
  factorial,
  findMax,
  calculateAverage
} = require('./mathUtils');

describe('mathUtils', () => {
  // Test the add function
  describe('add', () => {
    test('should add two positive numbers correctly', () => {
      expect(add(2, 3)).toBe(5);
      expect(add(10, 15)).toBe(25);
    });

    test('should add negative numbers correctly', () => {
      expect(add(-2, -3)).toBe(-5);
      expect(add(-10, 5)).toBe(-5);
    });

    test('should handle zero correctly', () => {
      expect(add(0, 0)).toBe(0);
      expect(add(5, 0)).toBe(5);
      expect(add(0, -3)).toBe(-3);
    });

    test('should handle decimal numbers', () => {
      expect(add(1.5, 2.5)).toBe(4);
      expect(add(0.1, 0.2)).toBeCloseTo(0.3);
    });
  });

  // Test the subtract function
  describe('subtract', () => {
    test('should subtract two numbers correctly', () => {
      expect(subtract(5, 3)).toBe(2);
      expect(subtract(10, 15)).toBe(-5);
    });

    test('should handle zero correctly', () => {
      expect(subtract(0, 0)).toBe(0);
      expect(subtract(5, 0)).toBe(5);
      expect(subtract(0, 3)).toBe(-3);
    });

    test('should handle negative numbers', () => {
      expect(subtract(-5, -3)).toBe(-2);
      expect(subtract(-5, 3)).toBe(-8);
    });
  });

  // Test the multiply function
  describe('multiply', () => {
    test('should multiply two positive numbers correctly', () => {
      expect(multiply(3, 4)).toBe(12);
      expect(multiply(7, 8)).toBe(56);
    });

    test('should handle zero correctly', () => {
      expect(multiply(0, 5)).toBe(0);
      expect(multiply(5, 0)).toBe(0);
      expect(multiply(0, 0)).toBe(0);
    });

    test('should handle negative numbers', () => {
      expect(multiply(-3, 4)).toBe(-12);
      expect(multiply(-3, -4)).toBe(12);
    });

    test('should handle decimal numbers', () => {
      expect(multiply(2.5, 4)).toBe(10);
      expect(multiply(0.1, 0.3)).toBeCloseTo(0.03);
    });
  });

  // Test the divide function
  describe('divide', () => {
    test('should divide two numbers correctly', () => {
      expect(divide(10, 2)).toBe(5);
      expect(divide(15, 3)).toBe(5);
      expect(divide(7, 2)).toBe(3.5);
    });

    test('should handle negative numbers', () => {
      expect(divide(-10, 2)).toBe(-5);
      expect(divide(10, -2)).toBe(-5);
      expect(divide(-10, -2)).toBe(5);
    });

    test('should throw error when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
      expect(() => divide(-5, 0)).toThrow('Cannot divide by zero');
    });

    test('should handle zero dividend', () => {
      expect(divide(0, 5)).toBe(0);
      expect(divide(0, -3)).toBe(-0);
    });
  });

  // Test the isEven function
  describe('isEven', () => {
    test('should return true for even numbers', () => {
      expect(isEven(2)).toBe(true);
      expect(isEven(4)).toBe(true);
      expect(isEven(100)).toBe(true);
      expect(isEven(0)).toBe(true);
      expect(isEven(-2)).toBe(true);
    });

    test('should return false for odd numbers', () => {
      expect(isEven(1)).toBe(false);
      expect(isEven(3)).toBe(false);
      expect(isEven(99)).toBe(false);
      expect(isEven(-1)).toBe(false);
      expect(isEven(-3)).toBe(false);
    });
  });

  // Test the factorial function
  describe('factorial', () => {
    test('should calculate factorial correctly for positive numbers', () => {
      expect(factorial(0)).toBe(1);
      expect(factorial(1)).toBe(1);
      expect(factorial(2)).toBe(2);
      expect(factorial(3)).toBe(6);
      expect(factorial(4)).toBe(24);
      expect(factorial(5)).toBe(120);
    });

    test('should throw error for negative numbers', () => {
      expect(() => factorial(-1)).toThrow('Factorial is not defined for negative numbers');
      expect(() => factorial(-5)).toThrow('Factorial is not defined for negative numbers');
    });
  });

  // Test the findMax function
  describe('findMax', () => {
    test('should find maximum number in array', () => {
      expect(findMax([1, 2, 3, 4, 5])).toBe(5);
      expect(findMax([10, 3, 7, 1, 9])).toBe(10);
      expect(findMax([-1, -5, -2])).toBe(-1);
    });

    test('should handle single element array', () => {
      expect(findMax([42])).toBe(42);
      expect(findMax([-10])).toBe(-10);
    });

    test('should handle array with duplicate values', () => {
      expect(findMax([3, 3, 3])).toBe(3);
      expect(findMax([1, 5, 5, 2])).toBe(5);
    });

    test('should throw error for empty array', () => {
      expect(() => findMax([])).toThrow('Input must be a non-empty array');
    });

    test('should throw error for non-array input', () => {
      expect(() => findMax('not an array')).toThrow('Input must be a non-empty array');
      expect(() => findMax(null)).toThrow('Input must be a non-empty array');
      expect(() => findMax(undefined)).toThrow('Input must be a non-empty array');
    });
  });

  // Test the calculateAverage function
  describe('calculateAverage', () => {
    test('should calculate average correctly', () => {
      expect(calculateAverage([1, 2, 3, 4, 5])).toBe(3);
      expect(calculateAverage([10, 20, 30])).toBe(20);
      expect(calculateAverage([2, 4, 6, 8])).toBe(5);
    });

    test('should handle single element array', () => {
      expect(calculateAverage([42])).toBe(42);
      expect(calculateAverage([-10])).toBe(-10);
    });

    test('should handle negative numbers', () => {
      expect(calculateAverage([-1, -2, -3])).toBe(-2);
      expect(calculateAverage([-5, 5])).toBe(0);
    });

    test('should handle decimal numbers', () => {
      expect(calculateAverage([1.5, 2.5, 3.5])).toBeCloseTo(2.5);
      expect(calculateAverage([0.1, 0.2, 0.3])).toBeCloseTo(0.2);
    });

    test('should return 0 for empty array', () => {
      expect(calculateAverage([])).toBe(0);
    });

    test('should return 0 for non-array input', () => {
      expect(calculateAverage('not an array')).toBe(0);
      expect(calculateAverage(null)).toBe(0);
      expect(calculateAverage(undefined)).toBe(0);
    });
  });
});