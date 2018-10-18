'use strict'

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')

const drawBoard = (size) => {
  // row one
  console.log('Drawing Rows')

  for (let i = 0; i < size + 2; i++) {
    const rowID = `#row_${i}`
    const rowHTML = `<ol id=${rowID.slice(1, rowID.length)}> </ol>`
    $('#gameBoard').append(rowHTML)

    if (i % 2 === 0) { // Even Row
      $(rowID).addClass('even')
    } else { // Odd Row
      $(rowID).addClass('odd')
    }
    // Append 15 hex for test
    for (let j = 0; j < size + Math.floor(2 / 3 * size); j++) { // Add hexes
      const hexID = `#hex_${i}_${j}`
      if ((i > 0 && i < size + 1) && j > Math.ceil(i / 2) - 1 && j - size < Math.ceil(i / 2)) {
        $(rowID).append(`<li id="${hexID.slice(1, hexID.length)}"" class=hex></li>\n`)
      } else {
        $(rowID).append(`<li id="${hexID.slice(1, hexID.length)}"" class=hex></li>\n`)
        if (i === 0 && (j < size + 1)) { // Top row blue
          $(hexID).addClass('blue')
        } else if (i === size + 1 && (j >= Math.floor(size * 2 / 3) - 1 && j < size + Math.floor(size * 2 / 3) - 1)) {
          $(hexID).addClass('blue')
        } else if ((i > 0 && i < size + 1) && (j === Math.ceil(i / 2) - 1 || (j - size === Math.ceil(i / 2)))) {
          $(hexID).addClass('red')
        } else if ((i === size + 1) && (j === Math.ceil(i / 2) - 1)) {
          $(hexID).addClass('red')
        } else {
          $(hexID).addClass('hidden')
        }
      }
    }
  }
}

$(() => {
  drawBoard(5)
})
