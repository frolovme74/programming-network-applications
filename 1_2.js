function fillManual(arraySize, data) {
    const result = [];

    for (let i = 0; i < arraySize; i++) {
        result.push(data);
    }

    return result;
}

console.log(fillManual(3, 'a'));
