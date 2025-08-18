# Refactoring Code for Simplicity

Refactoring is all about improving the structure of your code without changing what it does. Some common techniques include renaming variables and functions for clarity, breaking large functions into smaller ones, removing duplicated code, and extracting repeated logic into reusable functions or modules. I think refactoring is really helpful because it makes code easier to read, maintain, and extend. In my experience, even small changes like better names or splitting up big functions can make a huge difference in how confident I feel working with the code later on.

# Example of Overly Complicated Code

```js
function getTotal(items) {
  let t = 0;
  for (let i = 0; i < items.length; i++) {
    if (
      typeof items[i] === "object" &&
      items[i] !== null &&
      "price" in items[i] &&
      "qty" in items[i]
    ) {
      t = t + items[i].price * items[i].qty;
    } else if (typeof items[i] === "number") {
      t = t + items[i];
    } else {
      // skip invalid
    }
  }
  return t;
}
```

This function tries to handle too many cases at once, mixes logic, and uses unclear variable names, making it hard to read and maintain.

# Refactored, Simpler Version

```js
function getTotal(items) {
  return items.reduce((total, item) => {
    if (typeof item === "number") {
      return total + item;
    }
    if (item && typeof item === "object" && "price" in item && "qty" in item) {
      return total + item.price * item.qty;
    }
    return total;
  }, 0);
}
```

This version uses clear variable names, separates the logic, and leverages array methods to make the code much easier to read and maintain.

# Reflections

**What made the original code complex?**
The original code was complex because it tried to handle too many cases in one function, used unclear variable names, and mixed different types of logic together. It was hard to follow what was happening, especially with all the nested conditions and lack of comments or structure.

**How did refactoring improve it?**
Refactoring made the code much easier to read and maintain. By using clear variable names, separating the logic, and using array methods like reduce, the function became shorter and more focused. Now, it's easy to see what the code is doing and to make changes in the future if needed.
