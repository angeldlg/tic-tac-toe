const player = (name, marker) => {
  marker = marker === 'o' ? '<i class="circle"></i>' : marker === 'x' ? '<i class="cross"></i>' : undefined

  return { name, marker }
}
//

const Game = (() => {
  const restart = document.querySelector('[data-restart]')
  const status = document.querySelector('[data-status]')
  const player2 = player('circle', 'o')
  const player1 = player('cross', 'x')
  let currentPlayer = player1
  let gameOver = false
  restart.textContent = `restart`
  status.textContent = `current turn: cross`
  //

  const getGameOver = () => gameOver

  restart.addEventListener('mousedown', () => {
    status.textContent = `current turn: cross`
    currentPlayer = player1
    gameOver = false
    Gameboard.reset()
    Gameboard.render()
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
    const board = Gameboard.get()
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
        return board[index] === currentPlayer.marker
      })
    })
  }

  function updateStatus() {
    if (checkWinner()) {
      status.textContent = `${currentPlayer.name} wins`
      gameOver = true
    } else if (!checkWinner()) {
      status.textContent = `current turn: ${currentPlayer.name}`
    }
  }

  function getPlayer() {
    return currentPlayer
  }

  return { updateTurn, updateStatus, getPlayer, getGameOver }
})()
//

const Gameboard = (() => {
  const cells = document.querySelectorAll('[data-cell]')
  let board = new Array(9).fill('')
  //

  cells.forEach((cell, index) => {
    cell.addEventListener('mousedown', () => {
      if (!Game.getGameOver()) {
        handleClick(index)
      }
    })
  })

  function handleClick(i) {
    if (board[i] === '') {
      board[i] = Game.getPlayer().marker
      Game.updateTurn()
      Game.updateStatus()
    }
    render()
  }

  function render() {
    cells.forEach((cell, index) => {
      cell.innerHTML = board[index]
    })
  }

  function reset() {
    board = new Array(9).fill('')
  }

  function get() {
    return board
  }

  return { render, reset, get }
})()
//
