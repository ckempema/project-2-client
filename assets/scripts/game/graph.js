'use strict'

//
const STANDARD_WEIGHT = 2
const MATCHED_WEIGHT = 1

const Node = require('./node.js')

class Graph {
  /* A graph class that stores the gameboard as a hash of nodes,
  also contains all gameplay structures logic such as switching player, taking turns, and checking for a winner
  */
  constructor (apiResponse) {
    this.id = apiResponse.id
    this.user = apiResponse.user
    this.size = apiResponse.size
    this.board = {} // TODO Change documentation from 2d array to object
    this.currentPlayer = 'R' // NOTE: First player will always be red with this
    this.red = []
    this.blue = []
    this.status = {
      over: apiResponse.status,
      winner: null
    }
    this.moves = apiResponse.moves
    this.movesMade = 0

    // Create size*size array as gameboard data structure:
    // For size rows create an array containing size nodes
    let idCount = 0
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const tempNode = new Node(idCount, row, col)
        this.board[tempNode.id] = tempNode
        idCount++
      }
    }

    this.setNodesFromMoves() // Fills in the appropriate colors for moves made
    this.generateBorderEdgeRelationships() // Generates the border nodes
    this.setAllEdgeRelationships() // Generates all edges for all nodes
    this._setPlayer()
    this.checkWin()
  }

  setNodesFromMoves () {
    let mutMoves = this.moves
    while (mutMoves.length > 0) {
      const row = parseInt(mutMoves.substr(0, 1), 16)
      const col = parseInt(mutMoves.substr(1, 1), 16)
      const color = mutMoves.substr(2, 1)
      this.board[row * this.size + col].setNode(color, this.id)
      mutMoves = mutMoves.slice(3, mutMoves.length)
      this.status.complexity += 1 // increment complexity
      this.movesMade += 1
    }
  }

  generateBorderEdgeRelationships () {
    /* Sets the imaginary nodes appropriatly within the graph, allowing for a checkwin based on IDs of `B1`, `B2`,  `R1`, and `R2` */
    const B1 = new Node('B1', Infinity, Infinity)
    const B2 = new Node('B2', Infinity, Infinity)
    const R1 = new Node('R1', Infinity, Infinity)
    const R2 = new Node('R2', Infinity, Infinity)
    for (let col = 0; col < this.size; col++) {
      this.board[col].coloredEdges['B1'] = MATCHED_WEIGHT
      this.board[col].allEdges['B1'] = MATCHED_WEIGHT
      this.blue.push(this.board[col])
      B1.coloredEdges[col] = MATCHED_WEIGHT
      B1.allEdges[col] = MATCHED_WEIGHT
      const id = (this.size) * (this.size - 1) + col
      this.board[id].coloredEdges['B2'] = MATCHED_WEIGHT
      this.board[id].allEdges['B2'] = MATCHED_WEIGHT
      this.blue.push(this.board[id])
      B2.coloredEdges[id] = MATCHED_WEIGHT
      B2.allEdges[id] = MATCHED_WEIGHT
    }
    for (let row = 0; row < this.size; row++) {
      const leftId = row * this.size
      const rightId = row * this.size + this.size - 1
      this.board[leftId].coloredEdges['R1'] = MATCHED_WEIGHT
      this.board[leftId].allEdges['R1'] = MATCHED_WEIGHT
      this.red.push(this.board[leftId])
      R1.coloredEdges[leftId] = MATCHED_WEIGHT
      R1.allEdges[leftId] = MATCHED_WEIGHT
      this.board[rightId].coloredEdges['R2'] = MATCHED_WEIGHT
      this.board[rightId].allEdges['R2'] = MATCHED_WEIGHT
      this.red.push(this.board[rightId])
      R2.coloredEdges[rightId] = MATCHED_WEIGHT
      R2.allEdges[rightId] = MATCHED_WEIGHT
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

  setNodeEdgeRelationships (row, col) {
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
      if (currentNode.fill === 'R') {
        if (!this.red.includes(currentNode)) {
          this.red.push(currentNode)
        }
      } else if (currentNode.fill === 'B') {
        if (!this.blue.includes(currentNode)) {
          this.blue.push(currentNode)
        }
      }
    }
  }

  setAllEdgeRelationships () {
    /* Dynamically sets all node edges */
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        this.setNodeEdgeRelationships(row, col)
      }
    }
  }

  takeTurn (row, col) {
    if (!this.status.over) { // While the game is not over
      const currentNode = this.board[row * this.size + col]
      if (currentNode.setNode(this.currentPlayer, this.id)) { // Set the node
        this.setNodeEdgeRelationships(row, col) // Check the edges of the adjacent nodes
        this.checkWin()
        const moveStr = row.toString(16) + col.toString(16) + this.currentPlayer
        this.moves += moveStr
        this.movesMade += 1
        this._switchPlayer()
        if (this.status.over) {
          $('#game-messages').html(`<h6> Start a New Game</h6>`)
        }
        return true
      } else {
        $('#game-messages').html(`<h6> Unable to place token </h6>`)
      }
    } else {
      $('#game-messages').html(`<h6> Game Over. Make a new Game to continue playing </h6>`)
    }
  }

  _switchPlayer () {
    /* Switches the player from red to blue or back as needed, with basic error validaton of the player. NOTE: Does not do any logic checking, must ensure that player should be switched before calling this function */
    switch (this.currentPlayer) {
      case 'R':
        this.currentPlayer = 'B'
        $('#game-messages').html(`<h6> Game ${this.id} Waiting for Player: Blue </h6>`)
        break
      case 'B':
        this.currentPlayer = 'R'
        $('#game-messages').html(`<h6> Game ${this.id} Waiting for Player: Red </h6>`)
        break
      default:
        this._setPlayer()
        $('#game-messages').html(`<h4>ERROR: Invalid Current Player: ${this.currentPlayer} </h4> <h6>Player set to${this.currentPlayer}</h6>`)
    }
  }

  _setPlayer () {
    /* Sets the current player based on status of red and blue arrays. Used when pulling in a game from the server */
    if (this.movesMade % 2 === 0) {
      this.currentPlayer = 'R'
    } else {
      this.currentPlayer = 'B'
    }
  }

  dijkstras (graph, startId, all = false) {
    const data = {}
    const unsearched = graph.slice()
    for (let i = 0; i < unsearched.length; i++) { // Initalize data for nodes
      data[unsearched[i].id] = {dist: Infinity, prev: undefined}
    }

    while (unsearched.length > 0) { // Until all nodes have been searched
      let lowestVal = data[unsearched[0].id].dist
      let lowestIdx = 0

      data[startId] = {dist: 0, prev: null} // Starting Node

      for (let i = 1; i < unsearched.length; i++) { // Find the shortest dist
        if (data[unsearched[i].id].dist < lowestVal) {
          lowestVal = data[unsearched[i].id].dist
          lowestIdx = i
        }
      }

      const currentNode = unsearched[lowestIdx]
      // console.log(currentNode, data[currentNode.id])
      if (all === true) { // Seach entire graph
        for (const key in currentNode.allEdges) { // Search all edges of connected node
          // console.log(`key: ${key} value: ${currentNode.allEdges[key]}`)
          const alt = data[currentNode.id].dist + currentNode.allEdges[key]
          // console.log(currentNode.id)
          if (data[key] !== undefined) {
            if (alt < data[key].dist) {
              data[key].dist = alt
              data[key].prev = currentNode.id
              // console.log(`${key} less than ${alt}`)
            }
          }
        }
      } else { // Only search colored Nodes
        for (const key in currentNode.coloredEdges) { // Search all edges of connected node
          const alt = data[currentNode.id].dist + currentNode.coloredEdges[key]
          if (data[key] !== undefined) {
            if (alt < data[key].dist) {
              data[key].dist = alt
              data[key].prev = currentNode.id
            }
          }
        }
      }
      unsearched.splice(lowestIdx, 1) // Remove node from unsearched
    }
    return data
  }

  turnAI () {
    let limit = 0
    while (limit < 1000) {
      const row = Math.floor(Math.random() * this.size)
      const col = Math.floor(Math.random() * this.size)
      if (this.takeTurn(row, col)) {
        return true
      } else {
        limit += 1
      }
    }
    $('#game-messages').html(`<h6> Unable to place AI Token given limits </h6>`)
  }

  fill () {
    let limit = 0
    while (limit < 10000) {
      const row = Math.floor(Math.random() * this.size)
      const col = Math.floor(Math.random() * this.size)
      this.takeTurn(row, col)
      limit += 1
    }
  }

  checkWin () {
    const check = ['R', 'B']
    for (let i = 0; i < check.length; i++) {
      const player = check[i]
      let data = {} // Store info for dikstras algoritm to run

      // Run dijkstras with the correct data
      if (player === 'R') {
        data = this.dijkstras(this.red, 'R1')
      } else if (player === 'B') {
        data = this.dijkstras(this.blue, 'B1')
      } else { // Validation check  (should never be reached)
        $('#game-messages').html(`ERROR: Invalid Player ${player} in graph/checkWin`)
        return false // Stop the function
      }

      // Check if a winner exists
      if (data[`${player}2`].dist < Infinity) { // if path exists
        let current = this.board[`${player}2`]
        while (data[current.id].prev !== undefined && data[current.id].prev !== null) {
          $(`#${this.id}-gameHex-${current.row}-${current.col}`).addClass(`win-${player}`)
          current = this.board[data[current.id].prev] // Go to previous node
        }
        this.status.over = true
        this.status.winner = player
      }
    }
  }
}

module.exports = Graph
