/**
 * String utility functions for demonstrating Jest unit testing
 */

// Function to capitalize first letter of a string
function capitalizeFirst(str) {
  if (typeof str !== 'string' || str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Function to reverse a string
function reverseString(str) {
  if (typeof str !== 'string') {
    throw new Error('Input must be a string');
  }
  return str.split('').reverse().join('');
}

// Function to check if string is a palindrome
function isPalindrome(str) {
  if (typeof str !== 'string') {
    return false;
  }
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

// Function to count words in a string
function countWords(str) {
  if (typeof str !== 'string') {
    return 0;
  }
  return str.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Function to truncate string with ellipsis
function truncateString(str, maxLength) {
  if (typeof str !== 'string') {
    return '';
  }
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength - 3) + '...';
}

// Function to extract email from string
function extractEmail(str) {
  if (typeof str !== 'string') {
    return null;
  }
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const match = str.match(emailRegex);
  return match ? match[0] : null;
}

module.exports = {
  capitalizeFirst: capitalizeFirst,
  reverseString: reverseString,
  isPalindrome: isPalindrome,
  countWords: countWords,
  truncateString: truncateString,
  extractEmail: extractEmail
};