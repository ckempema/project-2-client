'use strict'
// TODO: Add a graph ui section
const store = require('../store.js')
const showGameTemplate = require('../templates/game.handlebars')
const showAllGamesTemplate = require('../templates/games_listing.handlebars')

const drawBoard = (size, location, gameID, scale = 'regular') => {
  // WARNING: IT IS IMPOSSIBLE TO MODIFY THIS FUNCTION WITHOUT LASTING EFFECTS. FIX WHEN ABLE WITH PROPER TESTING
  let classMod = ''
  if (scale !== 'regular') {
    classMod = '-small'
  }

  $(`#${location}`).html('') // Empty the gameboard
  for (let i = 0; i < size + 2; i++) {
    const rowID = `#${gameID}-row-${i}`
    const rowHTML = `<ol id=${rowID.slice(1, rowID.length)}> </ol>`
    $(`#${location}`).append(rowHTML)

    if (i % 2 === 0) { // Even Row
      $(rowID).addClass(`even${classMod}`)
    } else { // Odd Row
      $(rowID).addClass(`odd${classMod}`)
    }

    // TODO: Clean this function up to the point of readable
    // TODO: Fix for all sizes; i.e drawBoard(5) or (7) doesent work
    for (let j = 0; j < size + Math.floor(2 / 3 * size); j++) { // Add hexes
      if ((i > 0 && i < size + 1) && j > Math.ceil(i / 2) - 1 && j - size < Math.ceil(i / 2)) {
        const relX = i - 1
        const relY = j - Math.ceil(i / 2)
        const tempID = `${gameID}-gameHex-${relX}-${relY}`
        $(rowID).append(`<li id="${tempID}"" class="hex${classMod}"></li>\n`)
      } else {
        const hexID = `#${gameID}-hex-${i}-${j}`
        $(rowID).append(`<li id="${hexID.slice(1, hexID.length)}"" class="hex${classMod}"></li>\n`)
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
  const size = response.game.size
  drawBoard(size, 'game-board', response.game.id)
  console.log(response) // NOTE: Remove Console.log from production environment
}

const getGamesSuccess = (response) => {
  const showGames = showAllGamesTemplate({games: response.games})
  $('#show-games-section').html('')
  $('#show-games-section').append(showGames)
  for (let i = 0; i < response.games.length; i++) {
    drawBoard(response.games[i].size, `board-${response.games[i].id}`, response.games[i].id, 'small')
  }
}

const getGameSuccess = (response) => {
  console.log(response)
  const showGames = showGameTemplate({game: response.game})
  $('#show-games-section').html('')
  $('#show-games-section').append(showGames)
  drawBoard(response.game.size, `board-${response.game.id}`, response.game.id, 'small')
}

const failure = (response) => {
  $('#game-messages').html('')
  const responseHTML = (`
    <h4>ERROR ${response.status}: ${response.statusText}</h4>
  `)
  $('#game-messages').append(responseHTML)
}

module.exports = {
  newGameSuccess,
  getGameSuccess,
  getGamesSuccess,
  failure
}
