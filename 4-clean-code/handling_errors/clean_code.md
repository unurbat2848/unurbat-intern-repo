# Handling Errors & Edge Cases

Handling errors and edge cases is important for writing reliable code. One common strategy is to use guard clauses—these are early checks at the start of a function that immediately return or throw an error if something is wrong. This keeps the main logic clean and avoids deep nesting. For example, you can check if a required parameter is missing or invalid right away and handle it before doing anything else.

Other good practices include using try/catch blocks to handle exceptions, validating inputs, and providing clear error messages. I think it's also helpful to consider what could go wrong (like empty arrays, null values, or unexpected types) and handle those cases up front. By planning for errors and edge cases, you make your code more robust and easier to debug.

## Example: Function Without Proper Error Handling

```js
function divide(a, b) {
  return a / b;
}
```

This function doesn't check if 'b' is zero or if 'a' and 'b' are valid numbers, so it can easily break or return unexpected results with invalid inputs.

## Refactored: Function With Proper Error Handling

```js
function divide(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new Error("Both arguments must be numbers");
  }
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}
```

This version uses guard clauses to check for invalid inputs and division by zero, making the function safer and more reliable.

## Reflections

**What was the issue with the original code?**
The original code didn't check for invalid inputs or division by zero, so it could easily break or give wrong results if used incorrectly. It assumed everything would always be valid, which isn't safe in real-world situations.

**How does handling errors improve reliability?**
By handling errors and edge cases, the function becomes much more reliable. It can catch problems early, give clear feedback, and avoid unexpected crashes or bugs. This makes the code safer to use and easier to debug if something goes wrong.
