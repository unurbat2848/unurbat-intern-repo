# Commenting & Documentation

Writing good comments and documentation is about making your code easier for others to understand. The best practice is to write clear, concise comments that explain why something is done, not just what is done. It's also helpful to document the purpose of functions, expected inputs and outputs, and any tricky logic. I think good documentation saves a lot of time in the long run because it helps everyone get up to speed quickly and reduces confusion. In my experience, even a few well-placed comments can make a big difference when coming back to code after a while.

## Example: Poorly Commented Code

```js
// add
function add(a, b) {
  // sum
  return a + b; // return
}
```

These comments are too vague and don't add any real value.

## Improved Comments

```js
// Adds two numbers and returns the result.
// Parameters:
//   a (number): The first number to add.
//   b (number): The second number to add.
// Returns:
//   number: The sum of a and b.
function add(a, b) {
  return a + b;
}
```

The improved comments explain what the function does, what the parameters are, and what is returned, making the code much easier to understand.

## Reflections

**When should you add comments?**
I think you should add comments when something in your code might not be obvious to someone else, like explaining why a tricky solution was used or describing the purpose of a function. Comments are also helpful for documenting expected inputs, outputs, and side effects.

**When should you avoid comments and instead improve the code?**
In my experience, if you feel the need to write a comment just to explain what the code is doing, it's usually better to rewrite the code to make it clearer. Using good variable and function names, and breaking down complex logic, often removes the need for extra comments. Comments should add value, not just repeat what the code already says.
