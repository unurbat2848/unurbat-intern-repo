// Function to check if an email address is in a valid format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Example usage
console.log(isValidEmail("test@example.com")); // true`
console.log(isValidEmail("invalid-email")); // false
