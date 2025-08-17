## Best Practices for Naming Variables and Functions
Based my research here is the best practices:
- Use clear, descriptive names that explain what the variable or function represents or does.
- Use camelCase for variables and functions in JavaScript (e.g., totalAmount, calculateSum).
- Avoid single-letter names except for simple loop counters.
- Be consistent with naming conventions throughout your codebase.
- Use verbs for function names (e.g., getUser, calculateTotal) and nouns for variables (e.g., userList, totalPrice).


## What makes a good variable or function name?
Good names are descriptive, specific, and follow consistent conventions. They make it easy to understand what the code is doing without extra comments.

## What issues can arise from poorly named variables?
Poorly named variables can cause confusion, make code harder to maintain, and increase the risk of bugs because it's not clear what each variable is for.

For example, here is the example poorly named variable and function.

```js
function fn(a, b) {
	let x = a + b;
	return x;
}
```
This code is unclear because the function and variable names don't describe their purpose.

## How did refactoring improve code readability?
I think refactoring with better names made the code much easier to read and understand. Anyone looking at the code can quickly see what each part does, which helps with maintenance and teamwork.

After refactored:

```js
function addNumbers(firstNumber, secondNumber) {
	let sum = firstNumber + secondNumber;
	return sum;
}
```
Now, it's obvious what the function does and what the variables represent.
