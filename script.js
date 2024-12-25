const grid = document.querySelector('.grid');
const turnIndicator = document.querySelector('.turn-indicator');
const resetButton = document.querySelector('.reset-btn');

// Create a 7x6 2D array to represent the grid (0 = empty, 1 = red, 2 = yellow)
const board = Array.from({ length: 6 }, () => Array(7).fill(0));

// Game variables
let currentPlayer = 1; // 1 = red, 2 = yellow

// Function to render the board
function renderBoard() {
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
      cell.classList.remove('red', 'yellow');
      if (board[row][col] === 1) cell.classList.add('red');
      else if (board[row][col] === 2) cell.classList.add('yellow');
    }
  }
}

// Function to check for a winner
function checkWinner(row, col, player) {
  function countInDirection(dr, dc) {
    let count = 0;
    let r = row + dr;
    let c = col + dc;
    while (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === player) {
      count++;
      r += dr;
      c += dc;
    }
    return count;
  }

  // Check all directions
  return (
    countInDirection(0, 1) + countInDirection(0, -1) >= 3 || // Horizontal
    countInDirection(1, 0) + countInDirection(-1, 0) >= 3 || // Vertical
    countInDirection(1, 1) + countInDirection(-1, -1) >= 3 || // Diagonal \
    countInDirection(1, -1) + countInDirection(-1, 1) >= 3 // Diagonal /
  );
}

// Function to handle a move
function handleMove(event) {
  if (!event.target.classList.contains('cell')) return;

  const col = parseInt(event.target.dataset.col);

  // Find the lowest available row in this column
  let row = -1;
  for (let r = 5; r >= 0; r--) {
    if (board[r][col] === 0) {
      row = r;
      break;
    }
  }

  if (row === -1) return; // Column is full

  // Update the board
  board[row][col] = currentPlayer;

  // Render the updated board
  renderBoard();

  // Check for a winner
  if (checkWinner(row, col, currentPlayer)) {
    const winner = currentPlayer === 1 ? 'RED' : 'YELLOW';
    alert(`${winner} wins!`);
    grid.removeEventListener('click', handleMove); // Disable further moves
    return;
  }

  // Switch players
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  turnIndicator.textContent = `${currentPlayer === 1 ? "RED" : "YELLOW"}'s Turn`;
}

// Add click event listener to the grid
grid.addEventListener('click', handleMove);

// Reset the game
resetButton.addEventListener('click', () => {
  // Clear the board
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      board[row][col] = 0;
    }
  }
  currentPlayer = 1; // Reset to RED's turn
  turnIndicator.textContent = `RED's Turn`;
  renderBoard();
  grid.addEventListener('click', handleMove); // Re-enable moves
});

// Render the initial board
renderBoard();
