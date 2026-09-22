function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}

// Example usage
const numbers = [10, 23, 45, 70, 11, 15];
const target = 70;
const result = linearSearch(numbers, target);

if (result !== -1) {
  console.log(`Element ${target} found at index ${result}`);
} else {
  console.log(`Element ${target} not found`);
}

module.exports = linearSearch;
