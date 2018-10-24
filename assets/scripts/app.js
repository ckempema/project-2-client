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

  $('#new-small-button').on('click', () => { logic.onNewGame(9) })
  $('#new-medium-button').on('click', () => { logic.onNewGame(11) })
  $('#new-large-button').on('click', () => { logic.onNewGame(13) })
  $('#get-games-button').on('click', logic.onGetGames)
  $('#ai-move-button').on('click', logic.onAiTurn)

  $('#show-sign-in-button').on('click', () => { $('#sign-in-box').show() })
  $('#cancel-sign-in-button').on('click', () => {
    $('#sign-in-box').hide()
    $('#sign-in-form').trigger('reset')
  })

  $('#show-sign-up-button').on('click', () => { $('#sign-up-box').show() })
  $('#cancel-sign-up-button').on('click', () => {
    $('#sign-up-box').hide()
    $('#sign-up-form').trigger('reset')
  })

  $('#show-ch-pwd-button').on('click', () => { $('#ch-pwd-box').show() })
  $('#cancel-ch-pwd-button').on('click', () => {
    $('#ch-pwd-box').hide()
    $('#change-password-form').trigger('reset')
  })
}
