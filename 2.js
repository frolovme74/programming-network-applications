function mergeAndSortDescending(...arrays) {
    return arrays
        .flat()
        .sort((a, b) => b - a)
        .join(' ');
}

const first = [1, 2, 3];
const second = [-1, -10, 20];

console.log(mergeAndSortDescending(first, second));
console.log(mergeAndSortDescending([5, 8], [1], [99, 0, -3]));
