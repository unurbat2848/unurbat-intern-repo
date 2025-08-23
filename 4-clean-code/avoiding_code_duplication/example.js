// Refactoring Duplicated Code and following DRY

function validateNumbers(...args) {
    if (!args.every(arg => typeof arg === 'number')) {
        throw new Error('Invalid input');
    }
}

function calculateDiscount(price, discount) {
    validateNumbers(price, discount);
    return price - (price * discount);
}

function calculateTax(price, taxRate) {
    validateNumbers(price, taxRate);
    return price + (price * taxRate);
}