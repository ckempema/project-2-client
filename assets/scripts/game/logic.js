'use strict'
// TODO: Implement game logic here
const store = require('../store.js')
const Graph = require('./graph.js')
// const Node = require('./node.js')

const connectBoard = (size) => {
  /* Connect an appropriatly sized board to event listenrs that call the on nodeClick function in this file. Note size is not validated in this function */
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      $(`#gameHex-${row}-${col}`).on('click', () => {
        onNodeClick(row, col)
      })
    }
  }
}

const setupBoard = (size) => {
  store.currentGame = new Graph(9)
  connectBoard(size)
}

const onNodeClick = (row, col) => {
  if (store.currentGame !== null && store.currentGame !== undefined) {
    console.log(`Setting [${row}, ${col}]`) // NOTE: Remove console log
    store.currentGame.takeTurn(row, col)
  } else {
    console.log('No Game Created') // NOTE: Remove console log
  }
}

module.exports = {
  setupBoard,
  onNodeClick
}
