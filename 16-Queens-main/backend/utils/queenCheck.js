function checkSolution(board) {
    if (board.length !== 16 || !board.every(row => row.length === 16)) {
        return false;
    }

    let rows = new Array(16).fill(0);
    let cols = new Array(16).fill(0);
    let mainDiagonals = new Map();  
    let antiDiagonals = new Map();  
    for (let row = 0; row < 16; row++) {
        for (let col = 0; col < 16; col++) {
            if (board[row][col] === 1) {
                if (++rows[row] > 1 || ++cols[col] > 1) {
                    return false;
                }

                let mainDiagIndex = row - col;
                if (mainDiagonals.has(mainDiagIndex)) {
                    return false;
                } else {
                    mainDiagonals.set(mainDiagIndex, true);
                }

                let antiDiagIndex = row + col;
                if (antiDiagonals.has(antiDiagIndex)) {
                    return false;
                } else {
                    antiDiagonals.set(antiDiagIndex, true);
                }
            }
        }
    }

  
    if (rows.reduce((acc, val) => acc + val, 0) !== 16) {
        return false;
    }

    return true; 
}

module.exports = { checkSolution };
