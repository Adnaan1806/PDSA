document.getElementById('startGameButton').addEventListener('click', startGame);
document.getElementById('nextRoundButton').addEventListener('click', nextRound);

let randomNumber, randomIndex, numberArray;

function startGame() {
    document.getElementById('gameArea').classList.remove('hidden');
    document.getElementById('startGameButton').classList.add('hidden');
    nextRound();
}

function nextRound() {
    generateRandomNumbers();
    randomNumber = Math.floor(Math.random() * 1000000) + 1;
    randomIndex = numberArray.indexOf(randomNumber);

    document.getElementById('randomNumberText').innerText = `Predict the index of the value: ${randomNumber}`;
    displayChoices();
    runSearchAlgorithms();
}

function generateRandomNumbers() {
    numberArray = Array.from({length: 5000}, () => Math.floor(Math.random() * 1000000) + 1);
    numberArray.sort((a, b) => a - b);
}

function displayChoices() {
    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = '';
    const choices = [randomIndex, randomIndex + 1, randomIndex - 1, Math.floor(Math.random() * 5000)];
    shuffleArray(choices);
    choices.forEach(choice => {
        const button = document.createElement('button');
        button.innerText = choice;
        button.addEventListener('click', () => handleChoice(choice));
        choicesContainer.appendChild(button);
    });
}

function handleChoice(choice) {
    const resultText = choice === randomIndex ? 'Correct!' : 'Wrong!';
    alert(resultText);
    if (resultText === 'Correct!') {
        const playerName = prompt("Enter your name:");
        saveUserScore(playerName, randomNumber, choice);
    }
    document.getElementById('nextRoundButton').classList.remove('hidden');
}

function saveUserScore(name, value, index) {
    const record = { name, value, index };
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push(record);
    localStorage.setItem('scores', JSON.stringify(scores));
}

function runSearchAlgorithms() {
    const searchMethods = [
        { name: 'Binary Search', func: binarySearch },
        { name: 'Jump Search', func: jumpSearch },
        { name: 'Exponential Search', func: exponentialSearch },
        { name: 'Fibonacci Search', func: fibonacciSearch },
        { name: 'Interpolation Search', func: interpolationSearch }
    ];

    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = '';

    searchMethods.forEach(method => {
        const start = performance.now();
        const index = method.func(numberArray, randomNumber);
        const end = performance.now();
        const timeTaken = (end - start).toFixed(4);

        const li = document.createElement('li');
        li.innerText = `${method.name}: Index found = ${index}, Time taken = ${timeTaken} ms`;
        resultsList.appendChild(li);
    });

    document.getElementById('statistics').classList.remove('hidden');
}

// Search Algorithms

function binarySearch(arr, x) {
    let left = 0;
    let right = arr.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === x) return mid;
        if (arr[mid] < x) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

function jumpSearch(arr, x) {
    const n = arr.length;
    const step = Math.floor(Math.sqrt(n));
    let prev = 0;
    let curr = step;

    while (arr[Math.min(curr, n) - 1] < x) {
        prev = curr;
        curr += step;
        if (prev >= n) return -1;
    }

    for (let i = prev; i < Math.min(curr, n); i++) {
        if (arr[i] === x) return i;
    }
    return -1;
}

function exponentialSearch(arr, x) {
    if (arr[0] === x) return 0;
    let i = 1;
    while (i < arr.length && arr[i] <= x) {
        i *= 2;
    }
    return binarySearch(arr.slice(i / 2, Math.min(i, arr.length)), x);
}

function fibonacciSearch(arr, x) {
    const n = arr.length;
    let fibMm2 = 0; // (m-2)'th Fibonacci number
    let fibMm1 = 1; // (m-1)'th Fibonacci number
    let fibM = fibMm2 + fibMm1; // m'th Fibonacci number

    while (fibM < n) {
        fibMm2 = fibMm1;
        fibMm1 = fibM;
        fibM = fibMm2 + fibMm1;
    }

    let offset = -1;
    while (fibM > 1) {
        const i = Math.min(offset + fibMm2, n - 1);

        if (arr[i] < x) {
            fibM = fibMm1;
            fibMm1 = fibMm2;
            fibMm2 = fibM - fibMm1;
            offset = i;
        } else if (arr[i] > x) {
            fibM = fibMm2;
            fibMm1 -= fibMm2;
            fibMm2 = fibM - fibMm1;
        } else return i;
    }

    if (fibMm1 && arr[offset + 1] === x) return offset + 1;
    return -1;
}

function interpolationSearch(arr, x) {
    let low = 0;
    let high = arr.length - 1;

    while (low <= high && x >= arr[low] && x <= arr[high]) {
        if (low === high) {
            if (arr[low] === x) return low;
            return -1;
        }
        const pos = low + Math.floor(((high - low) / (arr[high] - arr[low])) * (x - arr[low]));
        if (arr[pos] === x) return pos;
        if (arr[pos] < x) low = pos + 1;
        else high = pos - 1;
    }
    return -1;
}

// Utility Functions

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
