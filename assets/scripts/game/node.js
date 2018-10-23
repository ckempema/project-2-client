'use strict'

class Node {
  /* A class to represent the game hexagons as graph nodes. Maintains an x,y coordinate position, as well as a fill and a hash of `edges`; stored as a key with the row/column of the neighboring node as a key and the weight as a value */
  constructor (id, row, col) {
    this.id = id
    this.row = row
    this.col = col
    this.fill = null
    this.allEdges = {}
    this.coloredEdges = {}
  }

  setNode (fill, gameID) {
    /* if possible, set the nodes fill to either red or blue, using jquery to add classes to the appropriate node as well as using validation to ensure the fill is empty and a vaild input was passed

    Returns true if set, otherwise false */
    if (this.fill === null) {
      switch (fill) {
        case 'R':
          this.fill = fill
          $(`#${gameID}-gameHex-${this.row}-${this.col}`).addClass('red')
          return true
        case 'B':
          this.fill = fill
          $(`#${gameID}-gameHex-${this.row}-${this.col}`).addClass('blue')
          return true
        default:
          ('#game-messages').html(`<h6> ERROR: function setNode()--Invalid Player in: node.js/29</h6>`)
          return false
      }
    } else {
      ('#game-messages').html(`<h6> ERROR: function setNode()--Invalid Player in: node.js/33</h6>`)
      return false
    }
  }
}

module.exports = Node
