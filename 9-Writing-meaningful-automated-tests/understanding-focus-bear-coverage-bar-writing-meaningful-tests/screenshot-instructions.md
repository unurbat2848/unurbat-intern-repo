# Screenshot Instructions for Focus Bear Coverage Bar Issue

## Screenshots needed for nestjs-test-coverage.md

### For Question 1: "What does the coverage bar track, and why is it important?"
**Screenshot:** `image.png`
- **What to screenshot:** Terminal showing `npm run test:coverage` output
- **Focus on:** Coverage table with percentages and the "Jest: coverage threshold not met" messages
- **Put in:** `9-Writing-meaningful-automated-tests/understanding-focus-bear-coverage-bar-writing-meaningful-tests/images/image.png`

### For Question 2: "Why does Focus Bear enforce a minimum test coverage threshold?"
**Screenshot:** `image-1.png`
- **What to screenshot:** VS Code showing `jest.config.js` file
- **Focus on:** The `coverageThreshold` section showing 80% requirements for all metrics
- **Put in:** `9-Writing-meaningful-automated-tests/understanding-focus-bear-coverage-bar-writing-meaningful-tests/images/image-1.png`

### For Question 3: "How can high test coverage still lead to untested functionality?"
**Screenshot:** `image-2.png`
- **What to screenshot:** VS Code showing `security.controller.spec.ts`
- **Focus on:** The weak test vs better test comparison showing different assertion quality
- **Put in:** `9-Writing-meaningful-automated-tests/understanding-focus-bear-coverage-bar-writing-meaningful-tests/images/image-2.png`

### For Question 4: "What are examples of weak vs. strong test assertions?"
**Screenshot:** `image-3.png`
- **What to screenshot:** VS Code showing `products.service.spec.ts`
- **Focus on:** Strong assertions that verify specific behavior and values
- **Put in:** `9-Writing-meaningful-automated-tests/understanding-focus-bear-coverage-bar-writing-meaningful-tests/images/image-3.png`

### For Question 5: No specific screenshot needed
This question is answered conceptually based on the testing experience.

## Final Folder Structure:

```
9-Writing-meaningful-automated-tests/
└── understanding-focus-bear-coverage-bar-writing-meaningful-tests/
    ├── nestjs-test-coverage.md
    ├── screenshot-instructions.md
    └── images/
        ├── image.png     ← Coverage report output
        ├── image-1.png   ← Jest config with thresholds
        ├── image-2.png   ← Weak vs strong test examples
        └── image-3.png   ← Strong test assertions
```

## Testing Steps:

1. **Run coverage report:**
   ```bash
   cd demo-project
   npm run test:coverage
   ```

2. **View test files:**
   - Open `jest.config.js` to see threshold configuration
   - Open test files to see assertion examples
   - Compare weak vs strong test patterns