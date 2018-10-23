'use strict'
// TODO: Implement game logic here
const store = require('../store.js')
const Graph = require('./graph.js')
const api = require('./api.js')
const ui = require('./ui.js')
// const Node = require('./node.js')

const connectBoard = (size, id) => {
  /* Connect an appropriatly sized board to event listenrs that call the on nodeClick function in this file. Note size is not validated in this function */
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      $(`#${id}-gameHex-${row}-${col}`).on('click', () => {
        onNodeClick(row, col)
      })
    }
  }
}

const onNewGame = () => {
  event.preventDefault()
  const size = 9 // TODO Make Dynamic
  api.newGame(size)
    .then((response) => {
      ui.newGameSuccess(response)
      connectBoard(size, response.game.id)
      store.currentGame = new Graph(response.game)
    })
    .catch(ui.failure)
}

const onGetGames = () => {
  api.getGames()
    .then((response) => {
      if (store.currentGame !== null && store.currentGame !== undefined) { // Dont show the current game
        response.games = response.games.filter(game => game.id !== store.currentGame.id)
      }
      ui.getGamesSuccess(response)
      for (let i = 0; i < response.games.length; i++) {
        const temp = new Graph(response.games[i]) // Display moves on previews

      }
    })
    .catch(ui.failure)
}

const onGetGame = (id) => {
  api.getGame(1)
    .then((response) => {
      ui.getGameSuccess(response)
      for (let i = 0; i < response.games.length; i++) {
        const temp = new Graph(response.games[i])
        console.log(temp)
      }
    })
    .catch(ui.failure)
}

const onNodeClick = (row, col) => {
  // Validate that a current game exists
  // TODO: Write function header

  if (store.currentGame !== null && store.currentGame !== undefined) {
    store.currentGame.takeTurn(row, col)
    api.updateGame()
      .then(console.log)
      .catch(ui.failure)
  } else {
    console.log('No Game Created') // NOTE: Remove console log
  }
}

module.exports = {
  onNewGame,
  onGetGame,
  onGetGames,
  onNodeClick
}
