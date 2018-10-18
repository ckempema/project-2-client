'use strict'
// TODO: Add a graph class that uses nodes to play the gameBoard
const Node = require('./node.js')

class Graph {
  /* A graph class that stores the gameboard as a two dimensional array of nodes,
  also contains all gameplay structures logic such as switching player, taking turns, and checking for a winner
  */
  constructor (size) {
    this.size = size
    this.board = []
    this.currentPlayer = 'R' // NOTE: First player will always be red with this

    // Create size*size array as gameboard data structure:
    // For size rows create an array containing size nodes
    let idCount = 0
    for (let row = 0; row < size; row++) {
      const rowArr = []
      for (let col = 0; col < size; col++) {
        rowArr.push(new Node(idCount, row, col))
        idCount++
      }
      this.board.push(rowArr)
    }
  }

  takeTurn (row, col) {
    if (this.board[row][col].setNode(this.currentPlayer)) {
      this._switchPlayer()
      this.checkWin()
    } else {
      console.log(`graph/takeTurn failed to setNode(${row},${col})`) // NOTE: log
      // TODO: Output turn failure messages to html here
    }
  }

  _switchPlayer () {
    switch (this.currentPlayer) {
      case 'R':
        this.currentPlayer = 'B'
        break
      case 'B':
        this.currentPlayer = 'R'
        break
      default:
        console.log(`ERROR: Invalid Current Player: ${this.currentPlayer}`)
        console.log(`Setting Player to 'R'`) // NOTE: Remove console logs
    }
  }

  checkWin () {
    // TODO write check win function
  }
}

module.exports = Graph
