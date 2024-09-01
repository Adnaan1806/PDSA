document.getElementById('generateCosts').addEventListener('click', generateRandomCosts);
document.getElementById('calculate').addEventListener('click', calculateMinimumCost);

let costMatrix = [];

function generateRandomCosts() {
    const tasks = parseInt(document.getElementById('tasks').value);
    const employees = parseInt(document.getElementById('employees').value);

    if (tasks !== employees) {
        alert("Number of tasks and employees should be the same for this example.");
        return;
    }

    costMatrix = [];
    const matrixDiv = document.getElementById('costMatrix');
    matrixDiv.innerHTML = '';

    let html = '<table>';
    html += '<tr><th></th>';
    for (let j = 0; j < tasks; j++) {
        html += `<th>T${j + 1}</th>`;
    }
    html += '</tr>';

    for (let i = 0; i < employees; i++) {
        let row = [];
        html += `<tr><th>E${i + 1}</th>`;
        for (let j = 0; j < tasks; j++) {
            const randomCost = Math.floor(Math.random() * 181) + 20; // Random cost between 20 and 200
            row.push(randomCost);
            html += `<td>${randomCost}</td>`;
        }
        html += '</tr>';
        costMatrix.push(row);
    }
    html += '</table>';
    matrixDiv.innerHTML = html;
}

function calculateMinimumCost() {
    if (costMatrix.length === 0) {
        alert("Please generate a cost matrix first.");
        return;
    }

    const resultDiv = document.getElementById('results');
    const start = performance.now();
    const minCost = hungarianAlgorithm(costMatrix);
    const end = performance.now();

    resultDiv.innerHTML = `Minimum Cost: $${minCost}<br>Time Taken: ${(end - start).toFixed(2)} ms`;

    saveResultToDatabase(minCost, end - start);
}

// Mock function to represent the Hungarian Algorithm
function hungarianAlgorithm(matrix) {
    // Replace this mock result with the actual implementation
    return Math.floor(Math.random() * 1000); // Placeholder return value
}

function saveResultToDatabase(cost, time) {
    fetch('/saveResult', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cost, time })
    }).then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch((error) => console.error('Error:', error));
}
