var createGame = require('voxel-engine');
var walk = require('voxel-walk')

var game = createGame({
  chunkDistance: 2,
  generate: function(x, y, z) {
    return (y === 0) ? 1 : 0
  },
  materials: [['grass', 'dirt', 'grass_dirt'], 'brick'],
  texturePath: 'textures/'
})
var container = document.body
game.appendTo(container)
game.paused = false

// create a player
var createPlayer = require('voxel-player')(game)
var player = createPlayer('textures/shama.png')
player.yaw.position.set(0, 2, 0)
player.possess()

// use debug
var debug = require('./')(game)
debug.axis([0, 2, 0])
