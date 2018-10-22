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
        moves: 0
      }
    }
  })
}

module.exports = {
  newGame
}
