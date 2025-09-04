/**
 * Unit tests for stringUtils functions using Jest
 */

const {
  capitalizeFirst,
  reverseString,
  isPalindrome,
  countWords,
  truncateString,
  extractEmail
} = require('./stringUtils');

describe('stringUtils', () => {
  // Test the capitalizeFirst function
  describe('capitalizeFirst', () => {
    test('should capitalize first letter of lowercase string', () => {
      expect(capitalizeFirst('hello')).toBe('Hello');
      expect(capitalizeFirst('world')).toBe('World');
      expect(capitalizeFirst('javascript')).toBe('Javascript');
    });

    test('should handle already capitalized strings', () => {
      expect(capitalizeFirst('Hello')).toBe('Hello');
      expect(capitalizeFirst('WORLD')).toBe('World');
    });

    test('should handle mixed case strings', () => {
      expect(capitalizeFirst('hELLO')).toBe('Hello');
      expect(capitalizeFirst('jAvAsCrIpT')).toBe('Javascript');
    });

    test('should handle empty string', () => {
      expect(capitalizeFirst('')).toBe('');
    });

    test('should handle single character', () => {
      expect(capitalizeFirst('a')).toBe('A');
      expect(capitalizeFirst('Z')).toBe('Z');
    });

    test('should handle non-string input', () => {
      expect(capitalizeFirst(null)).toBe(null);
      expect(capitalizeFirst(undefined)).toBe(undefined);
      expect(capitalizeFirst(123)).toBe(123);
    });
  });

  // Test the reverseString function
  describe('reverseString', () => {
    test('should reverse a string correctly', () => {
      expect(reverseString('hello')).toBe('olleh');
      expect(reverseString('world')).toBe('dlrow');
      expect(reverseString('JavaScript')).toBe('tpircSavaJ');
    });

    test('should handle palindromes', () => {
      expect(reverseString('racecar')).toBe('racecar');
      expect(reverseString('level')).toBe('level');
    });

    test('should handle empty string', () => {
      expect(reverseString('')).toBe('');
    });

    test('should handle single character', () => {
      expect(reverseString('a')).toBe('a');
      expect(reverseString('Z')).toBe('Z');
    });

    test('should handle strings with spaces and special characters', () => {
      expect(reverseString('hello world')).toBe('dlrow olleh');
      expect(reverseString('a!b@c#')).toBe('#c@b!a');
    });

    test('should throw error for non-string input', () => {
      expect(() => reverseString(123)).toThrow('Input must be a string');
      expect(() => reverseString(null)).toThrow('Input must be a string');
      expect(() => reverseString(undefined)).toThrow('Input must be a string');
    });
  });

  // Test the isPalindrome function
  describe('isPalindrome', () => {
    test('should identify simple palindromes', () => {
      expect(isPalindrome('racecar')).toBe(true);
      expect(isPalindrome('level')).toBe(true);
      expect(isPalindrome('mom')).toBe(true);
      expect(isPalindrome('dad')).toBe(true);
    });

    test('should handle case insensitive palindromes', () => {
      expect(isPalindrome('Racecar')).toBe(true);
      expect(isPalindrome('Level')).toBe(true);
      expect(isPalindrome('MoM')).toBe(true);
    });

    test('should handle palindromes with spaces and punctuation', () => {
      expect(isPalindrome('A man a plan a canal Panama')).toBe(true);
      expect(isPalindrome('race a car')).toBe(false);
      expect(isPalindrome('Was it a car or a cat I saw?')).toBe(true);
    });

    test('should handle non-palindromes', () => {
      expect(isPalindrome('hello')).toBe(false);
      expect(isPalindrome('world')).toBe(false);
      expect(isPalindrome('javascript')).toBe(false);
    });

    test('should handle empty string', () => {
      expect(isPalindrome('')).toBe(true);
    });

    test('should handle single character', () => {
      expect(isPalindrome('a')).toBe(true);
      expect(isPalindrome('Z')).toBe(true);
    });

    test('should return false for non-string input', () => {
      expect(isPalindrome(123)).toBe(false);
      expect(isPalindrome(null)).toBe(false);
      expect(isPalindrome(undefined)).toBe(false);
    });
  });

  // Test the countWords function
  describe('countWords', () => {
    test('should count words in simple sentences', () => {
      expect(countWords('hello world')).toBe(2);
      expect(countWords('JavaScript is awesome')).toBe(3);
      expect(countWords('one two three four five')).toBe(5);
    });

    test('should handle single word', () => {
      expect(countWords('hello')).toBe(1);
      expect(countWords('JavaScript')).toBe(1);
    });

    test('should handle multiple spaces', () => {
      expect(countWords('hello    world')).toBe(2);
      expect(countWords('  JavaScript   is   awesome  ')).toBe(3);
    });

    test('should handle empty string and whitespace only', () => {
      expect(countWords('')).toBe(0);
      expect(countWords('   ')).toBe(0);
      expect(countWords('\t\n')).toBe(0);
    });

    test('should handle strings with leading/trailing spaces', () => {
      expect(countWords('  hello world  ')).toBe(2);
      expect(countWords('\thello\tworld\n')).toBe(2);
    });

    test('should return 0 for non-string input', () => {
      expect(countWords(123)).toBe(0);
      expect(countWords(null)).toBe(0);
      expect(countWords(undefined)).toBe(0);
    });
  });

  // Test the truncateString function
  describe('truncateString', () => {
    test('should truncate string when longer than maxLength', () => {
      expect(truncateString('Hello world', 8)).toBe('Hello...');
      expect(truncateString('JavaScript is awesome', 10)).toBe('JavaScr...');
    });

    test('should return original string when shorter than maxLength', () => {
      expect(truncateString('Hello', 10)).toBe('Hello');
      expect(truncateString('JS', 5)).toBe('JS');
    });

    test('should return original string when equal to maxLength', () => {
      expect(truncateString('Hello', 5)).toBe('Hello');
      expect(truncateString('JavaScript', 10)).toBe('JavaScript');
    });

    test('should handle very short maxLength', () => {
      expect(truncateString('Hello', 3)).toBe('...');
      expect(truncateString('Hello', 4)).toBe('H...');
    });

    test('should handle empty string', () => {
      expect(truncateString('', 5)).toBe('');
      expect(truncateString('', 0)).toBe('');
    });

    test('should return empty string for non-string input', () => {
      expect(truncateString(123, 5)).toBe('');
      expect(truncateString(null, 5)).toBe('');
      expect(truncateString(undefined, 5)).toBe('');
    });
  });

  // Test the extractEmail function
  describe('extractEmail', () => {
    test('should extract valid email from string', () => {
      expect(extractEmail('Contact us at hello@example.com')).toBe('hello@example.com');
      expect(extractEmail('My email is john.doe@company.org')).toBe('john.doe@company.org');
      expect(extractEmail('user123@test-domain.co.uk is my address')).toBe('user123@test-domain.co.uk');
    });

    test('should extract first email when multiple exist', () => {
      expect(extractEmail('Email me at first@test.com or second@test.com')).toBe('first@test.com');
    });

    test('should handle strings without email', () => {
      expect(extractEmail('No email here')).toBe(null);
      expect(extractEmail('Almost an email @ but not quite')).toBe(null);
      expect(extractEmail('invalid@')).toBe(null);
    });

    test('should handle edge cases', () => {
      expect(extractEmail('test@domain')).toBe(null); // Missing TLD
      expect(extractEmail('@domain.com')).toBe(null); // Missing username
      expect(extractEmail('test@.com')).toBe(null); // Invalid domain
    });

    test('should handle empty string', () => {
      expect(extractEmail('')).toBe(null);
    });

    test('should return null for non-string input', () => {
      expect(extractEmail(123)).toBe(null);
      expect(extractEmail(null)).toBe(null);
      expect(extractEmail(undefined)).toBe(null);
    });

    test('should handle complex email formats', () => {
      expect(extractEmail('user+tag@domain.com')).toBe('user+tag@domain.com');
      expect(extractEmail('user.name@sub.domain.co.uk')).toBe('user.name@sub.domain.co.uk');
      expect(extractEmail('user123+test@example-domain.org')).toBe('user123+test@example-domain.org');
    });
  });
});