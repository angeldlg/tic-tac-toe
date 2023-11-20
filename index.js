'use strict';

// Player factory function
const Player = (name, marker) => {
  // Convert marker to HTML representation
  marker = marker === 'o' ? '<i class="circle"></i>' : marker === 'x' ? '<i class="cross"></i>' : undefined;
  return { name, marker };
};

// Game board module
const board = (() => {
  let board = new Array(9).fill('');

  function set(index, marker) {
    // Set marker on the board at the specified index
    board[index] = marker;
  }

  function get() {
    // Get the current state of the board
    return board;
  }

  function reset() {
    // Reset the board to an empty state
    board = new Array(9).fill('');
  }

  return { set, get, reset };
})();

// Game logic module
const game = (() => {
  const player1 = Player('cross', 'x');
  const player2 = Player('circle', 'o');
  let round = 1;
  let is_over;

  function currPlayer() {
    // Determine the current player based on the round number
    return round % 2 === 1 ? player1 : player2;
  }

  function updateRound() {
    // Increment the round counter
    round++;
  }

  function reset() {
    // Reset the round counter
    round = 1;
  }

  function stop(won) {
    // Set the game state to over with an optional parameter indicating the winner
    return (is_over = won);
  }

  function over() {
    // Check if the game is over
    return is_over;
  }

  function checkWinner() {
    const win_combos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    // Check if the current player has a winning combination on the board
    return win_combos.some((combo) => {
      return combo.every((index) => {
        return board.get()[index] === currPlayer().marker;
      });
    });
  }

  return { currPlayer, updateRound, checkWinner, reset, over, stop };
})();

// Display module
const display = (() => {
  const restart_button = document.querySelector('[data-restart]');
  const cells = document.querySelectorAll('[data-cell]');

  // Add event listeners to each cell for user interaction
  cells.forEach((cell, index) => {
    cell.addEventListener('mousedown', () => {
      // Handle click on the cell
      if (cell.innerHTML !== '') return;
      handleClick(index);
    });
  });

  // Add event listener to the restart button
  restart_button.addEventListener('mousedown', () => {
    // Reset the game state, board, and update the display
    game.stop(false);
    board.reset();
    game.reset();
    status();
    render();
  });

  function status(won) {
    const status = document.querySelector('[data-status]');

    // Update the game status message based on the game state
    if (won) {
      status.innerHTML = `${game.currPlayer().marker}won`;
    } else {
      status.innerHTML = `${game.currPlayer().marker}turn`;
    }
  }

  function handleClick(i) {
    // Set the current player's marker on the board and update the game state
    board.set(i, game.currPlayer().marker);
    if (game.over()) return;
    if (game.checkWinner()) {
      // If a winner is found, stop the game and update the status
      game.stop(true);
      status(true);
    }
    game.updateRound();
    if (!game.over()) {
      // If the game is not over, update the status
      status();
    }
    render();
  }

  function render() {
    // Render the current state of the board on the display
    cells.forEach((cell, index) => {
      cell.innerHTML = board.get()[index];
    });
  }
})();
