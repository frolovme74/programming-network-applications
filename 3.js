function inverse(array, leaveCount = 0) {
    const result = [...array];

    let start = 0;
    let end = result.length;

    if (leaveCount > 0) {
        start = leaveCount;
    } else if (leaveCount < 0) {
        end = result.length + leaveCount;
    }

    if (start >= end || start < 0 || end > result.length) {
        return result;
    }

    const partToReverse = result.slice(start, end).reverse();

    result.splice(start, partToReverse.length, ...partToReverse);

    return result;
}

const data = [1, 2, 3, 4, 5];

console.log(inverse(data));

console.log(inverse(data, 2));

console.log(inverse(data, -2));
