'use strict'

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')
const states = require('./states.js')
const logic = require('./game/logic.js')

$(() => {
  const size = 9
  states.drawBoard(size)
  logic.setupBoard(size)
})
