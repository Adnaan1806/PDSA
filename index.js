document.getElementById("startGameButton").addEventListener("click", startGame);
document.getElementById("nextRoundButton").addEventListener("click", nextRound);

let randomNumber, randomIndex, numberArray;

function startGame() {
  document.getElementById("gameArea").classList.remove("hidden");
  document.getElementById("startGameButton").classList.add("hidden");
  nextRound();
}

function nextRound() {
  generateRandomNumbers();
  randomNumber = Math.floor(Math.random() * 1000000) + 1;
  randomIndex = numberArray.indexOf(randomNumber);

  // Regenerate random number if not found
  while (randomIndex === -1) {
    randomNumber = Math.floor(Math.random() * 1000000) + 1;
    randomIndex = numberArray.indexOf(randomNumber);
  }

  document.getElementById(
    "randomNumberText"
  ).innerText = `Predict the index of the value: ${randomNumber}`;
  displayChoices();
  runSearchAlgorithms();
}

function generateRandomNumbers() {
  numberArray = Array.from(
    { length: 5000 },
    () => Math.floor(Math.random() * 1000000) + 1
  );
  randomNumber = Math.floor(Math.random() * 1000000) + 1;
  numberArray.push(randomNumber); // Ensure the random number is added to the array
  numberArray.sort((a, b) => a - b);
}

function displayChoices() {
  const choicesContainer = document.getElementById("choices");
  choicesContainer.innerHTML = "";
  const choices = [
    randomIndex,
    randomIndex + 1,
    randomIndex - 1,
    Math.floor(Math.random() * 5000),
  ];
  shuffleArray(choices);
  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.innerText = choice;
    button.addEventListener("click", () => handleChoice(choice));
    choicesContainer.appendChild(button);
  });
}

function handleChoice(choice) {
  const resultText = choice === randomIndex ? "Correct!" : "Wrong!";
  alert(resultText);
  if (resultText === "Correct!") {
    const playerName = prompt("Enter your name:");
    saveUserScore(playerName, randomNumber, choice);
  }
  document.getElementById("nextRoundButton").classList.remove("hidden");
}

function saveName() {
  const playerName = document.getElementById("playerNameInput").value;

  if (playerName.trim() !== "") {
    saveUserScore(playerName, randomNumber, randomIndex);
    document.getElementById("nameModal").classList.add("hidden");
  } else {
    alert("Please enter a valid name.");
  }
}

function saveUserScore(name, value, index) {
  const data = { name, value, index };

  fetch("http://localhost:4001/saveResponse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        alert("Score saved successfully!");
      } else {
        alert("Error saving score.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while saving the score.");
    });
}

function runSearchAlgorithms() {
  const searchMethods = [
    { name: "Binary Search", func: binarySearch },
    { name: "Jump Search", func: jumpSearch },
    { name: "Exponential Search", func: exponentialSearch },
    { name: "Fibonacci Search", func: fibonacciSearch },
    { name: "Interpolation Search", func: interpolationSearch },
  ];

  const resultsList = document.getElementById("resultsList");
  resultsList.innerHTML = "";

  searchMethods.forEach((method) => {
    const start = performance.now();
    const index = method.func(numberArray, randomNumber);
    const end = performance.now();
    const timeTaken = (end - start).toFixed(4);

    const li = document.createElement("li");
    li.innerText = `${method.name}: Index found = ${index}, Time taken = ${timeTaken} ms`;
    resultsList.appendChild(li);
  });

  document.getElementById("statistics").classList.remove("hidden");
}



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
  const m = Math.floor(Math.sqrt(n));
  let prev = 0;
  let curr = m;

  while (arr[Math.min(curr, n) - 1] < x) {
    prev = curr;
    curr += m;
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
  let fibSec = 0; // (m-2)'th Fibonacci number
  let fibfst = 1; // (m-1)'th Fibonacci number
  let f = fibSec + fibfst; // m'th Fibonacci number

  while (f < n) {
   fibSec = fibfst;
    fibfst = f;
    f = fibSec + fibfst;
  }

  let offset = -1;
  while (f > 1) {
    const i = Math.min(offset + fibSec, n - 1);

    if (arr[i] < x) {
      f = fibfst;
      fibfst = fibSec;
     fibSec = f - fibfst;
      offset = i;
    } else if (arr[i] > x) {
      f = fibSec;
      fibfst -= fibSec;
     fibSec = f - fibfst;
    } else return i;
  }

  if (fibfst && arr[offset + 1] === x) return offset + 1;
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
    const idx = low + Math.floor(((high - low) / (arr[high] - arr[low])) * (x - arr[low]));
    if (arr[idx] === x) return idx;
    if (arr[idx] < x) low = idx + 1;
    else high = idx - 1;
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
