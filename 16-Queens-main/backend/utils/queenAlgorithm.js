
function isSafe(queens, row, col) {
    for (let i = 0; i < row; i++) {
      if (queens[i] === col || Math.abs(queens[i] - col) === Math.abs(i - row)) {
        return false;
      }
    }
    return true;
  }
  
  function solveNQueensUtil(queens, row, solutions) {
    if (row === 16) {
      solutions.push([...queens]);
      return;
    }
  
    for (let col = 0; col < 16; col++) {
      if (isSafe(queens, row, col)) {
        queens[row] = col;
        solveNQueensUtil(queens, row + 1, solutions);
        queens[row] = -1; 
      }
    }
  }
  
  function generate16QueensSolutions(maxCount) {
    const queens = new Array(16).fill(-1);
    const solutions = [];
    solveNQueensUtil(queens, 0, solutions);
    
    return solutions.slice(0, maxCount);
  }
  
  module.exports = generate16QueensSolutions;
  