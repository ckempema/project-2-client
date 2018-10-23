'use strict'
const store = require('./store.js')

const signedOut = () => {
  $('#authed-buttons').hide()
  $('#sign-in-box').hide()
  $('#sign-up-box').hide()
  $('#ch-pwd-box').hide()
  $('#game').hide()

  $('#unauthed-buttons').show()
  resetData()
}

const signedIn = () => {
  $('#unauthed-buttons').hide()
  $('#sign-in-box').hide()
  $('#sign-up-box').hide()
  $('#ch-pwd-box').hide()

  $('#authed-buttons').show()
  $('#game').show()
}

const resetData = () => {
  store.currentGame = null
  store.user = null
  $('#auth_messages').html('')
  $('#gameBoard').html('')
  $('#game-messages').html('')
  $('#user-message').html('')
  $('#show-games-section').html('')
}
module.exports = {
  signedOut,
  signedIn,
  resetData
}
