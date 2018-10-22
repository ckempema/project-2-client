'use strict'

const signedOut = () => {
  $('#authed-buttons').hide()
  $('#sign-in-box').hide()
  $('#sign-up-box').hide()
  $('#ch-pwd-box').hide()
  $('#game').hide()
}

const signedIn = () => {
  $('#unauthed-buttons').hide()
  $('#sign-in-box').hide()
  $('#sign-up-box').hide()
  $('#ch-pwd-box').hide()

  $('#authed-buttons').show()
  $('#game').show()
}

module.exports = {
  signedOut,
  signedIn
}
