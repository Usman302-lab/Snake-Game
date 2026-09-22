function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}

// Example usage (array must be sorted)
const sortedNumbers = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91];
const target = 23;
const result = binarySearch(sortedNumbers, target);

if (result !== -1) {
  console.log(`Element ${target} found at index ${result}`);
} else {
  console.log(`Element ${target} not found`);
}

module.exports = binarySearch;
