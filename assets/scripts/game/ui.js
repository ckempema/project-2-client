'use strict'
// TODO: Add a graph ui section

const drawBoard = (size) => {
  // WARNING: DO NOT CHANGE THIS FUNCTION WITHOUT TIME TO FIX EVERYTHING YOU JUST MESSED UP. This function is an absolute mess of math and should needs to be fixed, however any minor change, no matter how small, will screw things up and be very annoying. So a total rewrite will be required. Be warned
  $('#gameBoard').html('') // Empty the gameboard
  for (let i = 0; i < size + 2; i++) {
    const rowID = `#row-${i}`
    const rowHTML = `<ol id=${rowID.slice(1, rowID.length)}> </ol>`
    $('#gameBoard').append(rowHTML)

    if (i % 2 === 0) { // Even Row
      $(rowID).addClass('even')
    } else { // Odd Row
      $(rowID).addClass('odd')
    }

    // TODO: Clean this function up to the point of readable
    // TODO: Fix for all sizes; i.e drawBoard(5) or (7) doesent work
    for (let j = 0; j < size + Math.floor(2 / 3 * size); j++) { // Add hexes
      if ((i > 0 && i < size + 1) && j > Math.ceil(i / 2) - 1 && j - size < Math.ceil(i / 2)) {
        const relX = i - 1
        const relY = j - Math.ceil(i / 2)
        const id = `gameHex-${relX}-${relY}`
        $(rowID).append(`<li id="${id}"" class=hex></li>\n`)
      } else {
        const hexID = `#hex-${i}-${j}`
        $(rowID).append(`<li id="${hexID.slice(1, hexID.length)}"" class=hex></li>\n`)
        if (i === 0 && (j < size + 1)) { // Top row blue
          $(hexID).addClass('blue')
        } else if (i === size + 1 && (j >= Math.floor(size * 2 / 3) - 1 && j < size + Math.floor(size * 2 / 3) - 1)) { // Bottom Row blue
          $(hexID).addClass('blue')
        } else if ((i > 0 && i < size + 1) && (j === Math.ceil(i / 2) - 1 || (j - size === Math.ceil(i / 2)))) { // All but one red
          $(hexID).addClass('red')
        } else if ((i === size + 1) && (j === Math.ceil(i / 2) - 1)) { // Bottom Left Red
          $(hexID).addClass('red')
        } else {
          $(hexID).addClass('hidden')
        }
      }
    }
  }
}

const newGameSuccess = (response) => {
  const size = 9
  drawBoard(size)
  $('#game-messages').text(response)
}

const failure = (response) => {
  $('#game-messages').html('')
  const responseHTML = (`
    <h3>ERROR: Failed to authenticate with server</h3>
    `)
  $('#game-messages').append(responseHTML)
  $('#game-messages').append(response)
}

module.exports = {
  newGameSuccess,
  failure
}
