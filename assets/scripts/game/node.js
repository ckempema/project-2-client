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

  setNode (fill) {
    /* if possible, set the nodes fill to either red or blue, using jquery to add classes to the appropriate node as well as using validation to ensure the fill is empty and a vaild input was passed

    Returns true if set, otherwise false */
    if (this.fill === null) {
      switch (fill) {
        case 'R':
          this.fill = fill
          $(`#gameHex-${this.row}-${this.col}`).addClass('red')
          return true
        case 'B':
          this.fill = fill
          $(`#gameHex-${this.row}-${this.col}`).addClass('blue')
          return true
        default:
          console.log(`INVALID node/setNode: ${fill} `) // NOTE: remove log
          return false
      }
    } else {
      console.log(`ERROR node/setNode: Unable to set node`) // NOTE: remove log
      return false
    }
  }
}

module.exports = Node
