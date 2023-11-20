'use strict'

const Player = (name, marker) => {
  marker = marker === 'o' ? '<i class="circle"></i>' : marker === 'x' ? '<i class="cross"></i>' : undefined
  return { name, marker }
}

const board = (() => {
  let board = new Array(9).fill('')
  //

  function set(index, marker) {
    board[index] = marker
  }

  function get() {
    return board
  }

  function reset() {
    board = new Array(9).fill('')
  }

  return { set, get, reset }
})()
//

const game = (() => {
  const player1 = Player('cross', 'x')
  const player2 = Player('circle', 'o')
  let round = 1
  let is_over
  //

  function currPlayer() {
    return round % 2 === 1 ? player1 : player2
  }

  function updateRound() {
    round++
  }

  function reset() {
    round = 1
  }

  function stop(won) {
    return (is_over = won)
  }

  function over() {
    return is_over
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
    ]
    //

    return win_combos.some((combo) => {
      return combo.every((index) => {
        return board.get()[index] === currPlayer().marker
      })
    })
  }

  return { currPlayer, updateRound, checkWinner, reset, over, stop }
})()
//

const display = (() => {
  const restart_button = document.querySelector('[data-restart]')
  const cells = document.querySelectorAll('[data-cell]')
  //

  cells.forEach((cell, index) => {
    cell.addEventListener('mousedown', () => {
      if (cell.innerHTML !== '') return
      handleClick(index)
    })
  })

  restart_button.addEventListener('mousedown', () => {
    game.stop(false)
    board.reset()
    game.reset()
    status()
    render()
  })

  function status(won) {
    const status = document.querySelector('[data-status]')
    //

    if (won) {
      status.innerHTML = `${game.currPlayer().marker}won`
    } else {
      status.innerHTML = `${game.currPlayer().marker}turn`
    }
  }

  function handleClick(i) {
    board.set(i, game.currPlayer().marker)
    if (game.over()) return
    if (game.checkWinner()) {
      game.stop(true)
      status(true)
    }
    game.updateRound()
    if (!game.over()) {
      status()
    }
    render()
  }

  function render() {
    cells.forEach((cell, index) => {
      cell.innerHTML = board.get()[index]
    })
  }
})()
//
