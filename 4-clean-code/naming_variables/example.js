// refactored version with better variable names

function processArray(inputArray, threshold) {
    let sumAboveThreshold = 0;
    for (let i = 0; i < inputArray.length; i++) {
        if (inputArray[i] > threshold) {
            sumAboveThreshold += inputArray[i];
        }
    }
    let evenNumbers = [];
    for (let j = 0; j < inputArray.length; j++) {
        if (inputArray[j] % 2 === 0) {
            evenNumbers.push(inputArray[j]);
        }
    }
    let doubledEvenNumbers = evenNumbers.map(num => num * 2);
    return { sumAboveThreshold, doubledEvenNumbers };

}