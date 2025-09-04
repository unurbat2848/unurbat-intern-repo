/**
 * Simple math utility functions for demonstrating Jest unit testing
 */

// Basic addition function
function add(a, b) {
  return a + b;
}

// Basic subtraction function
function subtract(a, b) {
  return a - b;
}

// Basic multiplication function
function multiply(a, b) {
  return a * b;
}

// Basic division function with error handling
function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

// Function to check if a number is even
function isEven(number) {
  return number % 2 === 0;
}

// Function to calculate factorial
function factorial(n) {
  if (n < 0) {
    throw new Error('Factorial is not defined for negative numbers');
  }
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

// Function to find maximum number in array
function findMax(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    throw new Error('Input must be a non-empty array');
  }
  return Math.max.apply(Math, numbers);
}

// Function to calculate average of numbers
function calculateAverage(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return 0;
  }
  const sum = numbers.reduce(function(acc, num) { return acc + num; }, 0);
  return sum / numbers.length;
}

module.exports = {
  add: add,
  subtract: subtract,
  multiply: multiply,
  divide: divide,
  isEven: isEven,
  factorial: factorial,
  findMax: findMax,
  calculateAverage: calculateAverage
};