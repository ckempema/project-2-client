'use strict'

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

const onNewGame = (size) => {
  event.preventDefault()
  api.newGame(size)
    .then((response) => {
      ui.newGameSuccess(response)
      connectBoard(response.game.size, response.game.id)
      store.currentGame = new Graph(response.game)
      $('#game-messages').html(`<h6> New Game Created ID: ${store.currentGame.id}    ${store.currentGame.size}x${store.currentGame.size}  Player: Red</h6>`)
      $('#show-games-section').html(``)
    })
    .catch(ui.failure)
}

const onGetGames = () => {
  api.getGames()
    .then((response) => {
      if (response.games.length > 0) { // If games exist
        if (store.currentGame !== null && store.currentGame !== undefined) { // Dont show the current game
          response.games = response.games.filter(game => game.id !== store.currentGame.id)
        }
        ui.getGamesSuccess(response)
        for (let i = 0; i < response.games.length; i++) {
          const temp = new Graph(response.games[i]) // Display moves on previews
          $(`#view-${response.games[i].id}`).on('click', () => {
            setCurrentGame(response.games[i].id)
          })
          $(`#remove-${response.games[i].id}`).on('click', () => {
            onDeleteGame(response.games[i].id)
          })
        }
      } else {
        $('#show-games-section').html('<h5> No Games Available </h5>')
      }
    })
    .catch(ui.failure)
}

const onDeleteGame = (id) => {
  api.deleteGame(id)
    .then(() => { ui.deleteSuccess(id) })
    .catch(ui.failure)
}

const setCurrentGame = (id) => {
  api.loadGame(id)
    .then((response) => {
      ui.loadGameSuccess(response)
      store.currentGame = new Graph(response.game)
      connectBoard(response.game.size, response.game.id)
      if (store.currentGame.currentPlayer === 'R') {
        $('#game-messages').html(`<h6> Loaded Game ${store.currentGame.id} Player: Red`)
      } else {
        $('#game-messages').html(`<h6> Loaded Game ${store.currentGame.id} Player: Blue`)
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
      .then()
      .catch(ui.failure)
  } else {
    $('#game-messages').html(`<h6> ERROR: No game created</h6>`)
  }
}

const onAiTurn = () => {
  if (store.currentGame !== null && store.currentGame !== undefined) {
    store.currentGame.turnAI()
    api.updateGame()
      .then()
      .catch(ui.failure)
  } else {
    $('#game-messages').html(`<h6> ERROR: No game created</h6>`)
  }
}

const onFill = () => {
  if (store.currentGame !== null && store.currentGame !== undefined) {
    store.currentGame.fill()
    api.updateGame()
      .then()
      .catch(ui.failure)
  } else {
    $('#game-messages').html(`<h6> ERROR: No game created</h6>`)
  }
}

module.exports = {
  onNewGame,
  onGetGames,
  onNodeClick,
  onAiTurn,
  onFill
}
