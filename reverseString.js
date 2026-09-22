function reverseString(str) {
  let reversed = "";

  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }

  return reversed;
}

function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === reverseString(cleaned);
}

// Example usage
const text = "Hello World";
console.log(`Original: ${text}`);
console.log(`Reversed: ${reverseString(text)}`);

const palindromeTest = "A man a plan a canal Panama";
console.log(`"${palindromeTest}" is palindrome: ${isPalindrome(palindromeTest)}`);

module.exports = { reverseString, isPalindrome };
