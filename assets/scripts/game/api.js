'use strict'

// TODO: Create the game API calls. Create Ruby API in conjunciton with this step
const config = require('../config.js')
const store = require('../store.js')

const newGame = (size) => {
  /* Create a new empty game from the server
  returns server response which contains an (empty) game object if good */
  return $.ajax({
    headers: {
      Authorization: `Token token=${store.user.token}`
    },
    url: config.apiUrl + '/games',
    method: 'POST',
    data: {
      game: {
        size: size,
        status: 'false',
        moves: ''
      }
    }
  })
}

const getGames = () => {
  /* Create a new empty game from the server
  returns server response which contains an (empty) game object if good */
  return $.ajax({
    headers: {
      Authorization: `Token token=${store.user.token}`
    },
    url: config.apiUrl + '/games',
    method: 'GET'
  })
}

const loadGame = (id) => {
  return $.ajax({
    headers: {
      Authorization: `Token token=${store.user.token}`
    },
    url: config.apiUrl + '/games/' + id,
    method: 'GET'
  })
}

const deleteGame = (id) => {
  return $.ajax({
    headers: {
      Authorization: `Token token=${store.user.token}`
    },
    url: config.apiUrl + '/games/' + id,
    method: 'DELETE'
  })
}

const updateGame = () => {
  return $.ajax({
    headers: {
      Authorization: `Token token=${store.user.token}`
    },
    url: config.apiUrl + '/games/' + store.currentGame.id,
    method: 'PATCH',
    data: {
      game: {
        size: store.currentGame.size,
        status: store.currentGame.status.over,
        moves: store.currentGame.moves
      }
    }
  })
}

module.exports = {
  newGame,
  loadGame,
  getGames,
  updateGame,
  deleteGame
}
