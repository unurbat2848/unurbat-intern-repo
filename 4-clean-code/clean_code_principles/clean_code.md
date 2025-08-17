#  Understanding Clean Code Principles
## Clean Code Principles

**Simplicity** – Code should be as simple as possible. Avoid adding unnecessary complexity or features you don't need. Simple code is easier to understand, test, and maintain.

**Readability** – Code should be easy for others (and your future self) to read and understand. Use clear names, proper indentation, and comments where needed so anyone can quickly grasp what your code does.

**Maintainability** – Write code so that future developers, including yourself, can easily update or fix it. This means organizing your code well, using clear logic, and avoiding hacks that make things harder to change later.

**Consistency** – Follow the same style and conventions throughout your codebase. Consistent code is easier to read and reduces confusion, especially when working in a team.

**Efficiency** – Write code that runs well and uses resources wisely, but don't over-optimize too early. Focus on making your code work first, then improve performance only if it's really needed.


## Find an example of messy code online (or write one yourself) and describe why it's difficult to read.

Here is an example of messy code in Python:

```python
def a(x,y):z=0
 for i in range(x):
  for j in range(y):z+=i*j
 return z
```

This code is hard to read because the function and variable names are not descriptive, the formatting is inconsistent, and everything is crammed into one line. It's not clear what the function is supposed to do, and it's easy to make mistakes or miss bugs in code like this.


## Rewrite the code in a cleaner, more structured way.

Here is the cleaned-up version of the code:

```python
def calculate_sum_of_products(rows, cols):
    total = 0
    for i in range(rows):
        for j in range(cols):
            total += i * j
    return total

# Example usage
result = calculate_sum_of_products(3, 4)
print(result)
```

This version uses clear function and variable names, proper indentation, and includes an example of how to use the function. It's much easier to read and understand what the code is doing.


