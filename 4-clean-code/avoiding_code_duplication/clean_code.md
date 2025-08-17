
# Avoiding Code Duplication

## "Don't Repeat Yourself" (DRY) principle.
The "Don't Repeat Yourself" (DRY) principle means you should avoid writing the same code in multiple places. I think the main idea is to keep your codebase clean and easy to maintain by putting repeated logic into a single function or module. In my experience, when you follow DRY, you only need to update your code in one place if something changes, which saves time and helps prevent bugs. To use DRY, I try to spot patterns or repeated code and refactor them into reusable functions or components. This makes the code shorter, easier to read, and much easier to update in the future.

## What were the issues with duplicated code?
When I had duplicated code, I found it hard to keep everything up to date. For example, if I had the same calculation copied in three different places, I had to remember to update all of them if something changed. If I missed one, it could cause bugs that were hard to track down. Duplicated code also made the file longer and harder to read.

## How did refactoring improve maintainability?
After refactoring, I put the repeated logic into a single function. Now, if I need to change the calculation, I only have to update it in one place. This makes the code much easier to maintain and reduces the risk of bugs. For example, instead of copying the same sum logic everywhere, I just call my addNumbers function whenever I need it. The code is shorter, clearer, and much easier to work with.

## Example of Duplicated Code and DRY Refactor

Here is an example of duplicated code:

```js
// Duplicated code
let sum1 = 2 + 3;
let sum2 = 5 + 7;
let sum3 = 10 + 15;
```
If I want to change how I calculate the sum, I have to update every line. It's easy to miss one and introduce a bug.

After refactoring to follow DRY:

```js
// DRY version
function addNumbers(a, b) {
	return a + b;
}

let sum1 = addNumbers(2, 3);
let sum2 = addNumbers(5, 7);
let sum3 = addNumbers(10, 15);
```
Now, if I need to change the logic, I only update the addNumbers function. This makes the code much easier to maintain and less error-prone.