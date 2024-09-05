function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function populateTableWithRandomNumbers() {
    const cells = [
        "cell-b2", "cell-c2", "cell-c3", "cell-d2", "cell-d3", 
        "cell-d4", "cell-e2", "cell-e3", "cell-e4", "cell-e5",
        "cell-f2", "cell-f3", "cell-f4", "cell-f5", "cell-f6", 
        "cell-g2", "cell-g3", "cell-g4", "cell-g5", "cell-g6",
        "cell-g7", "cell-h2", "cell-h3", "cell-h4", "cell-h5",
        "cell-h6", "cell-h7", "cell-h8", "cell-i2", "cell-i3",
        "cell-i4", "cell-i5", "cell-i6", "cell-i7", "cell-i8",
        "cell-i9", "cell-j2", "cell-j3", "cell-j4", "cell-j5",
        "cell-j6", "cell-j7", "cell-j8", "cell-j9", "cell-j10",
        "cell-j11"
        
    ];

    cells.forEach(function(cellId) {
        const cell = document.getElementById(cellId);
        if (cell) {
            cell.textContent = getRandomNumber(5, 50); 
        }
    });
}

window.onload = populateTableWithRandomNumbers;

function dijkstra(graph, startNode) {
let distances = {};
let visited = {};
let unvisited = new Set(Object.keys(graph));

for (let node in graph) {
    distances[node] = Infinity;
}
distances[startNode] = 0;

while (unvisited.size > 0) {
    let currentNode = null;
    for (let node of unvisited) {
        if (currentNode === null || distances[node] < distances[currentNode]) {
            currentNode = node;
        }
    }
    for (let neighbor in graph[currentNode]) {
        if (unvisited.has(neighbor)) {
            let tentativeDistance = distances[currentNode] + graph[currentNode][neighbor];
            if (tentativeDistance < distances[neighbor]) {
                distances[neighbor] = tentativeDistance;
            }
        }
    }

    visited[currentNode] = true;
    unvisited.delete(currentNode);
}

return distances;
}

function bellmanFord(graph, startNode) {
let distances = {};

for (let node in graph) {
    distances[node] = Infinity;
}
distances[startNode] = 0;

for (let i = 0; i < Object.keys(graph).length - 1; i++) {
    for (let node in graph) {
        for (let neighbor in graph[node]) {
            let distance = distances[node] + graph[node][neighbor];
            if (distance < distances[neighbor]) {
                distances[neighbor] = distance;
            }
        }
    }
}

return distances;
}

let startTime = new Date().getTime();

function checkAnswer() {
const startCity = document.getElementById('startCity').value;
const endCity = document.getElementById('endCity').value;
const userDistance = parseInt(document.getElementById('distanceInput').value);

const graph = {
    "A": {"B": parseInt(document.getElementById("cell-b2").textContent)},
    "B": {"C": parseInt(document.getElementById("cell-c2").textContent), 
          "D": parseInt(document.getElementById("cell-d2").textContent)},
    "C": {"D": parseInt(document.getElementById("cell-d3").textContent)},
    "D": {"E": parseInt(document.getElementById("cell-e4").textContent)},
    "E": {"F": parseInt(document.getElementById("cell-f5").textContent)},
    "F": {"G": parseInt(document.getElementById("cell-g6").textContent)},
    "G": {"H": parseInt(document.getElementById("cell-h7").textContent)},
    "H": {"I": parseInt(document.getElementById("cell-i8").textContent)},
    "I": {"J": parseInt(document.getElementById("cell-j9").textContent)}
};

const dijkstraDistances = dijkstra(graph, startCity);
const bellmanFordDistances = bellmanFord(graph, startCity);

const correctDistanceDijkstra = dijkstraDistances[endCity];
const correctDistanceBellmanFord = bellmanFordDistances[endCity];

const resultDiv = document.getElementById('result');
const endTime = new Date().getTime(); 
const timeTaken = (endTime - startTime) / 1000; 

if (userDistance === correctDistanceDijkstra && userDistance === correctDistanceBellmanFord) {
    resultDiv.textContent = `Correct! The shortest distance from ${startCity} to ${endCity} is ${userDistance} km.`;
    document.getElementById('nameInputDiv').style.display = 'block';
    
    document.getElementById('saveNameBtn').addEventListener('click', function() {
        const userName = document.getElementById('nameInput').value;
        
        fetch('http://localhost:3000/save-result', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: userName,
                startCity: startCity,
                endCity: endCity,
                correctDistance: userDistance,
                timeTaken: timeTaken
            }),
        })
        .then(response => response.text())
        .then(data => {
            resultDiv.textContent += ` Result saved successfully!`;
            console.log('Success:', data);
        })
        .catch((error) => {
            resultDiv.textContent += ` Error saving result.`;
            console.error('Error:', error);
        });
    });
    
} else {
    resultDiv.textContent = `Incorrect. The shortest distance from ${startCity} to ${endCity} is ${correctDistanceDijkstra} km (Dijkstra) and ${correctDistanceBellmanFord} km (Bellman-Ford).`;
}
}

document.querySelector('button').addEventListener('click', checkAnswer);

