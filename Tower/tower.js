let rods = { A: [], B: [], C: [] };
let numDisks = 0;
let startTime;
let moveCount = 0;

function startGame() {
  numDisks = parseInt(document.getElementById("numDisks").value, 10);
  if (numDisks > 100 || numDisks < 1) {
    alert("Please enter a number between 1 and 100.");
    return;
  }

  rods = { A: [], B: [], C: [] };
  for (let i = numDisks; i >= 1; i--) {
    rods.A.push(i);
  }
  updateTowers();
  startTime = new Date();
  moveCount = 0; // Reset move count at the start of a new game
  updateMoveCount();
}

function updateTowers() {
    const towers = ['tower1', 'tower2', 'tower3'];
    const rodKeys = ['A', 'B', 'C'];
    const diskHeight = 30; // Height of each disk
    const diskMargin = 5;  // Margin between disks

    for (let i = 0; i < towers.length; i++) {
        const tower = document.getElementById(towers[i]);
        tower.innerHTML = '<div class="rod"></div>'; // Clear tower and add the rod
        const disks = rods[rodKeys[i]];

        for (let j = 0; j < disks.length; j++) {
            const diskSize = disks[j];
            const disk = document.createElement('div');
            disk.className = 'disk';
            disk.innerText = diskSize;
            disk.style.bottom = `${(diskHeight + diskMargin) * j}px`; // Adjust spacing based on disk height and margin
            disk.style.width = `${diskSize * 10}px`; // Example width adjustment
            tower.appendChild(disk);
        }
    }
}


function makeMove() {
  const moveInput = document.getElementById("moveInput").value.toUpperCase();
  const [fromRodChar, toRodChar] = moveInput.split(" ");

  if (rods[fromRodChar] && rods[toRodChar] && fromRodChar !== toRodChar) {
    const fromRod = rods[fromRodChar];
    const toRod = rods[toRodChar];

    if (fromRod.length === 0) {
      alert(`Invalid move! Rod ${fromRodChar} is empty.`);
    } else if (
      toRod.length === 0 ||
      fromRod[fromRod.length - 1] < toRod[toRod.length - 1]
    ) {
      toRod.push(fromRod.pop());
      moveCount++;
      updateTowers();
      updateMoveCount();
      checkForCompletion();
    } else {
      alert(
        `Invalid move! You cannot place a larger disk on top of a smaller disk.`
      );
    }
  } else {
    alert(`Invalid input! Please enter a valid move (e.g., A B).`);
  }
}

function updateMoveCount() {
  document.getElementById("moveCount").innerText = moveCount;
}

function checkForCompletion() {
  if (rods.C.length === numDisks) {
    const endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000 / 60; // Time taken in minutes
    alert(
      `Congratulations! You solved the puzzle in ${timeTaken.toFixed(
        2
      )} minutes with ${moveCount} moves.`
    );

    const playerName = prompt("Enter your name to save your score:");
    if (playerName) {
      saveScore(playerName, timeTaken.toFixed(2), moveCount);
    }
  }
}

function saveScore(playerName, timeTaken, moveCount) {
  fetch("http://localhost:3000/savePlayerData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerName, timeTaken, moveCount }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
      return response.text();
    })
    .then((data) => {
      console.log("Response data:", data);
      alert("Your score has been saved successfully!");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("There was an error saving your score. Please try again.");
    });
}
