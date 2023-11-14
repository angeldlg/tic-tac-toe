const player = (name, marker) => {
  marker = marker === 'o' ? '<i class="circle"></i>' : marker === 'x' ? '<i class="cross"></i>' : undefined

  return { name, marker }
}
//

const Game = (() => {
  const restart = document.querySelector('[data-restart]')
  const status = document.querySelector('[data-status]')
  const player1 = player('cross', 'x')
  const player2 = player('circle', 'o')
  status.textContent = `current turn: cross`
  restart.textContent = `restart`
  let currentPlayer = player2
  //

  restart.addEventListener('mousedown', () => {
    Gameboard.reset(currentPlayer)
  })

  function updateTurn() {
    if (currentPlayer === player1) {
      currentPlayer = player2
    } else if (currentPlayer === player2) {
      currentPlayer = player1
    }
    return currentPlayer
  }

  function checkWinner() {
    const winCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    //

    return winCombos.some((combo) => {
      return combo.every((index) => {
        return Gameboard.board[index] === currentPlayer.marker
      })
    })
  }

  function updateStatus() {
    if (checkWinner()) {
      status.textContent = `${currentPlayer.name} wins`
    } else if (!checkWinner()) {
      status.textContent = `current turn: ${currentPlayer.name}`
    }
  }

  return { player1, currentPlayer, status, updateTurn, checkWinner, updateStatus }
})()
//

const Gameboard = (() => {
  const cells = document.querySelectorAll('[data-cell]')
  let board = new Array(9).fill('')
  //

  cells.forEach((cell, index) => {
    cell.addEventListener('mousedown', () => {
      if (!Game.checkWinner()) {
        handleClick(index)
      }
    })
  })

  function handleClick(i) {
    const currentPlayer = Game.updateTurn()
    //

    if (board[i] === '') {
      board[i] = currentPlayer.marker
    }
    Game.updateStatus()
    update()
  }

  function update() {
    cells.forEach((cell, index) => {
      cell.innerHTML = board[index]
    })
  }

  function reset(c) {
    if (c === Game.player1) {
      Game.updateTurn()
    }
    board = new Array(9).fill('')
    Game.status.textContent = `current turn: cross`
    update()
  }

  return { board, reset }
})()
//
