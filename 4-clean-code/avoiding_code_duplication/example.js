// Example of Duplicated Code and DRY Refactor

function calculateDiscount(price, discount) {
    if (typeof price !== 'number' || typeof discount !== 'number') {
        throw new Error('Invalid input');
    }
    return price - (price * discount);
}

function calculateTax(price, taxRate) {
    if (typeof price !== 'number' || typeof taxRate !== 'number') {
        throw new Error('Invalid input');
    }
    return price + (price * taxRate);
}