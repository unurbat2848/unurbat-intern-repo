# Identifying & Fixing Code Smells

Code smells are patterns in code that might indicate a deeper problem, even if the code still works. Some common code smells include duplicated code, long functions, large classes, unclear variable names, and too many parameters. Others are things like magic numbers (hard-coded values), commented-out code, and functions that do too many things at once.

These smells make code harder to read, test, and maintain. They can hide bugs, make it difficult to add new features, and slow down development. I think spotting and fixing code smells early helps keep the codebase clean, reduces technical debt, and makes it easier for everyone to work with the code in the future.

## Code Smell Examples

### Magic Numbers & Strings

```js
// Bad: magic numbers and strings
let priceWithTax = price * 1.15;
if (userRole === "admin") {
  // ...
}
```

### Long Functions

```js
function processOrder(order) {
  // validate order
  // calculate total
  // apply discount
  // print receipt
  // send email
  // update inventory
  // ...all in one function (too long)
}
```

### Duplicate Code

```js
let sum1 = a + b;
let sum2 = c + d;
// ...same logic repeated instead of using a function
```

### Large Classes (God Objects)

```js
class OrderManager {
  // handles orders, payments, inventory, emails, reports, etc.
  // too many responsibilities in one class
}
```

### Deeply Nested Conditionals

```js
if (user) {
  if (user.isActive) {
    if (user.role === "admin") {
      // ...
    }
  }
}
```

### Commented-Out Code

```js
// let total = calculateTotal(order);
// sendEmail(user, message);
```

### Inconsistent Naming

```js
let x = 5;
let totalAmount = 10;
let calc = totalAmount + x;
// variable names don't clearly describe their purpose
```

## Refactored Code (No Code Smells)

### Magic Numbers & Strings (Fixed)

```js
const TAX_RATE = 0.15;
const ADMIN_ROLE = "admin";
let priceWithTax = price * (1 + TAX_RATE);
if (userRole === ADMIN_ROLE) {
  // ...
}
```

### Long Functions (Fixed)

```js
function processOrder(order) {
  validateOrder(order);
  const total = calculateTotal(order);
  const discountedTotal = applyDiscount(total, order.coupon);
  printReceipt(order, discountedTotal);
  updateInventory(order);
  sendConfirmationEmail(order);
}
// Each helper function does one thing
```

### Duplicate Code (Fixed)

```js
function add(a, b) {
  return a + b;
}
let sum1 = add(a, b);
let sum2 = add(c, d);
```

### Large Classes (God Objects) (Fixed)

```js
class OrderManager {
  // Only handles order logic
}
class PaymentManager {
  // Handles payment logic
}
class InventoryManager {
  // Handles inventory logic
}
// Responsibilities are separated
```

### Deeply Nested Conditionals (Fixed)

```js
if (!user) return;
if (!user.isActive) return;
if (user.role === "admin") {
  // ...
}
// Guard clauses reduce nesting
```

### Commented-Out Code (Fixed)

```js
// Remove unused code entirely
// let total = calculateTotal(order);
// sendEmail(user, message);
// (No longer in the codebase)
```

### Inconsistent Naming (Fixed)

```js
let itemCount = 5;
let totalAmount = 10;
let grandTotal = totalAmount + itemCount;
// Names are clear and consistent
```

## Reflections

**What code smells did you find in your code?**
I found several code smells in my code, like magic numbers, long functions, duplicate code, and inconsistent naming. There were also some deeply nested conditionals and commented-out code that made things harder to follow.

**How did refactoring improve the readability and maintainability of the code?**
Refactoring made the code much easier to read and work with. By breaking up long functions, removing duplication, and using clear names, the code became more organized and understandable. It’s now easier to make changes or add new features without getting lost in messy logic.

**How can avoiding code smells make future debugging easier?**
Avoiding code smells means the code is cleaner and more predictable, so it’s easier to spot where things go wrong. When the code is well-structured and not cluttered with bad patterns, debugging takes less time and you’re less likely to introduce new bugs while fixing old ones.
