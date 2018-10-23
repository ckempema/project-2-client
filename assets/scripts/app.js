'use strict'

const authEvents = require('./auth/events.js')
const states = require('./states.js')
const logic = require('./game/logic.js')

$(() => {
  states.signedOut()
  initEventListeners()
})

const initEventListeners = () => {
  $('#sign-up-form').on('submit', authEvents.onSignUp)
  $('#sign-in-form').on('submit', authEvents.onSignIn)
  $('#change-password-form').on('submit', authEvents.onChangePassword)
  $('#sign-out-button').on('click', authEvents.onSignOut)

  $('#new-game-button').on('click', logic.onNewGame)
  $('#get-games-button').on('click', logic.onGetGames)
  $('#get-button').on('click', logic.onGetGame)

  $('#show-sign-in-button').on('click', () => { $('#sign-in-box').show() })
  $('#cancel-sign-in-button').on('click', () => { $('#sign-in-box').hide() })

  $('#show-sign-up-button').on('click', () => { $('#sign-up-box').show() })
  $('#cancel-sign-up-button').on('click', () => { $('#sign-up-box').hide() })

  $('#show-ch-pwd-button').on('click', () => { $('#ch-pwd-box').show() })
  $('#cancel-ch-pwd-button').on('click', () => { $('#ch-pwd-box').hide() })
}
