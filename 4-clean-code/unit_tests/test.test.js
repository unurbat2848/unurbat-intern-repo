const { add } = require('./test');

describe('add', () => {
  test('adds two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('adds a positive and a negative number', () => {
    expect(add(5, -2)).toBe(3);
  });

  test('adds two negative numbers', () => {
    expect(add(-4, -6)).toBe(-10);
  });

  test('adds zero', () => {
    expect(add(0, 7)).toBe(7);
    expect(add(0, 0)).toBe(0);
  });
});
