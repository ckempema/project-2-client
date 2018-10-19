'use strict'

//
const STANDARD_WEIGHT = 100
const MATCHED_WEIGHT = 1

const Node = require('./node.js')

class Graph {
  /* A graph class that stores the gameboard as a two dimensional array of nodes,
  also contains all gameplay structures logic such as switching player, taking turns, and checking for a winner
  */
  constructor (size) {
    this.size = size
    this.board = {} // TODO Change documentation from 2d array to object
    this.currentPlayer = 'R' // NOTE: First player will always be red with this
    this.red = []
    this.blue = []
    this.status = {
      over: false,
      winner: null,
      complexity: 0
    }

    // Create size*size array as gameboard data structure:
    // For size rows create an array containing size nodes
    let idCount = 0
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const tempNode = new Node(idCount, row, col)
        this.board[tempNode.id] = tempNode
        idCount++
      }
    }
    this.generateBorderEdges()
    this.setAllEdges()
  }

  generateBorderEdges () {
    /* Sets the imaginary nodes appropriatly within the graph, allowing for a checkwin based on IDs of `B1`, `B2`,  `R1`, and `R2` */
    const B1 = new Node('B1', Infinity, Infinity)
    const B2 = new Node('B2', Infinity, Infinity)
    const R1 = new Node('R1', Infinity, Infinity)
    const R2 = new Node('R2', Infinity, Infinity)
    for (let col = 0; col < this.size; col++) {
      this.board[col].coloredEdges['B1'] = MATCHED_WEIGHT
      this.blue.push(this.board[col])
      B1.coloredEdges[col] = MATCHED_WEIGHT
      const id = (this.size) * (this.size - 1) + col
      this.board[id].coloredEdges['B2'] = MATCHED_WEIGHT
      this.blue.push(this.board[id])
      B2.coloredEdges[id] = MATCHED_WEIGHT
    }
    for (let row = 0; row < this.size; row++) {
      const leftId = row * this.size
      const rightId = row * this.size + this.size - 1
      this.board[leftId].coloredEdges['R1'] = MATCHED_WEIGHT
      this.red.push(this.board[leftId])
      R1.coloredEdges[leftId] = MATCHED_WEIGHT
      this.board[rightId].coloredEdges['R2'] = MATCHED_WEIGHT
      this.red.push(this.board[rightId])
      R2.coloredEdges[rightId] = MATCHED_WEIGHT
    }
    this.board['R1'] = R1
    this.board['R2'] = R2
    this.board['B1'] = B1
    this.board['B2'] = B2
    this.red.push(R1)
    this.red.push(R2)
    this.blue.push(B1)
    this.blue.push(B2)
  }

  setNodeEdges (row, col) {
    /* tests all nodes contained as adjustments to gameboard row and col in array possible. Then sets them based on color */
    const possible = [[-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0]]

    const currentNode = this.board[row * this.size + col]
    for (let i = 0; i < possible.length; i++) { // Test each adjustment
      const testRow = row + possible[i][0]
      const testCol = col + possible[i][1]
      if (testRow >= 0 && testCol >= 0 && testRow < this.size && testCol < this.size) { // Check that adjustment is within game board bounds
        const testNode = this.board[testRow * this.size + testCol]
        if (currentNode.fill === null || testNode.fill === null) { // if one of the nodes is not yet filled
          testNode.allEdges[currentNode.id] = STANDARD_WEIGHT
          currentNode.allEdges[testNode.id] = STANDARD_WEIGHT
        } else {
          if (currentNode.fill === testNode.fill) { // adjacent same color
            testNode.coloredEdges[currentNode.id] = MATCHED_WEIGHT
            testNode.allEdges[currentNode.id] = MATCHED_WEIGHT
            currentNode.coloredEdges[testNode.id] = MATCHED_WEIGHT
            currentNode.allEdges[testNode.id] = MATCHED_WEIGHT
          } else { // Different colored nodes; remove edge
            delete currentNode.allEdges[testNode.id]
            delete testNode.allEdges[currentNode.id]
          }
        }
      }
    }
  }

  setAllEdges () {
    /* Dynamically sets all node edges */
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        this.setNodeEdges(row, col)
      }
    }
  }

  takeTurn (row, col) {
    if (!this.status.over) { // While the game is not over
      const currentNode = this.board[row * this.size + col]
      if (currentNode.setNode(this.currentPlayer)) { // Set the node
        if (this.currentPlayer === 'R') { // Store in correct node/edge array
          this.red.push(currentNode)
        } else if (this.currentPlayer === 'B') {
          this.blue.push(currentNode)
        }
        this.setNodeEdges(row, col) // Check the edges of the adjacent nodes
        this.checkWin()
        this._switchPlayer()
      } else {
        console.log(`graph/takeTurn failed to setNode(${row},${col})`) // NOTE: log
        // TODO: Output turn failure messages to html here
      }
    } else {
      // TODO: Output game over failure message to html here
    }
  }

  _switchPlayer () {
    /* Switches the player from red to blue or back as needed, with basic error validaton of the player. NOTE: Does not do any logic checking, must ensure that player should be switched before calling this function */
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
    const data = {} // Store info for dikstras algoritm to run
    let unsearched = null

    if (this.currentPlayer === 'R') {
      unsearched = this.red.slice()
    } else if (this.currentPlayer === 'B') {
      unsearched = this.blue.slice()
    } else { // Validation check  (should never be reached)
      console.log(`ERROR: Invalid Player ${this.currentPlayer} in graph/checkWin`)
      return false // Stop the function
    }

    for (let i = 0; i < unsearched.length; i++) { // Initalize data for nodes
      data[unsearched[i].id] = {dist: Infinity, prev: undefined}
    }

    // Set the starting node
    data[`${this.currentPlayer}1`] = {dist: 0, prev: null} // R1 or B1

    while (unsearched.length > 0) { // Until all nodes have been searched
      let lowestVal = data[unsearched[0].id].dist
      let lowestIdx = 0

      for (let i = 1; i < unsearched.length; i++) { // Find the shortest dist
        if (data[unsearched[i].id].dist < lowestVal) {
          lowestVal = data[unsearched[i].id].dist
          lowestIdx = i
        }
      }

      const currentNode = unsearched[lowestIdx]

      for (const key in currentNode.coloredEdges) { // Search all edges of connected node
        const alt = data[currentNode.id].dist + currentNode.coloredEdges[key]
        if (data[key] !== undefined) {
          // console.log(`Data Key Defined`, currentNode.id, key,alt,data[key].dist)
          if (alt < data[key].dist) {
            data[key].dist = alt
            data[key].prev = currentNode.id
          }
        }
      }
      unsearched.splice(lowestIdx, 1) // Remove node from unsearched
    }

    if (data[`${this.currentPlayer}2`].dist < Infinity) { // if path exists
      let current = this.board[`${this.currentPlayer}2`]
      while (data[current.id].prev !== undefined && data[current.id].prev !== null) {
        $(`#gameHex-${current.row}-${current.col}`).addClass(`win_${this.currentPlayer}`)
        current = this.board[data[current.id].prev] // Go to previous node
      }
      this.status.over = true
      this.status.winner = this.currentPlayer
    }
  }
}

module.exports = Graph
