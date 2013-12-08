function Debug(opts) {
  if (opts.THREE) opts = {game: opts}
  this.game = opts.game
  this.gui = opts.gui || new (require('dat-gui')).GUI()
  this.liveData = true
  this._datum = []
  this._init()
  this.open()
}
module.exports = function(opts) {
  return new Debug(opts)
}
module.exports.Debug = Debug

Debug.prototype.axis = function(p, size) {
  p = p || [0, 1, 0]
  var helper = new this.game.THREE.AxisHelper(size || 10)
  helper.position.set(p[0], p[1], p[2])
  this.game.scene.add(helper)
  return helper
}

Debug.prototype.open = function() {
  (function open(folder) {
    folder.open()
    for (var i in folder.__folders) {
      open(folder.__folders[i])
    }
  }(this.folder))
}

Debug.prototype.close = function() {
  (function close(folder) {
    folder.close()
    for (var i in folder.__folders) {
      close(folder.__folders[i])
    }
  }(this.folder))
}

Debug.prototype._init = function() {
  var self = this
  this.folder = this.gui.addFolder('debug')
  this.folder.add(this, 'liveData').listen()
  this.folder.add(this.game, 'paused')
  this._player()
  this._camera()
  this._chunks()
  this._render()
  function update(folder) {
    for (var i in folder.__controllers) {
      folder.__controllers[i].updateDisplay()
    }
    for (var i in folder.__folders) {
      update(folder.__folders[i])
    }
  }
  this.game.on('tick', function() {
    if (self.liveData === true) {
      for (var i in self._datum) {
        self._datum[i].update()
      }
      update(self.folder)
    }
  })
  this.folder.open()
  return this.folder
}

Debug.prototype._player = function() {
  var folder = this.folder.addFolder('game.controls.target().avatar')
  function subfolder(name, el) {
    var sub = folder.addFolder(name)
    sub.add(el, 'x')
    sub.add(el, 'y')
    sub.add(el, 'z')
  }
  subfolder('position', this.game.controls.target().avatar.position)
  subfolder('rotation', this.game.controls.target().avatar.rotation)
}

Debug.prototype._camera = function() {
  var self = this
  function Camera(prop) {
    var selfself = this
    this.x = 0.01
    this.y = 0.01
    this.z = 0.01
    this.update = function() {
      var p = self.game[prop]()
      selfself.x = p[0]
      selfself.y = p[1]
      selfself.z = p[2]
    }
    self._datum.push(this)
  }
  var campos = this.folder.addFolder('game.cameraPosition()')
  var pos = new Camera('cameraPosition')
  campos.add(pos, 'x')
  campos.add(pos, 'y')
  campos.add(pos, 'z')
  var camrot = this.folder.addFolder('game.cameraVector()')
  var vec = new Camera('cameraVector')
  camrot.add(vec, 'x')
  camrot.add(vec, 'y')
  camrot.add(vec, 'z')
}

Debug.prototype._chunks = function() {
  var self = this
  var folder = this.folder.addFolder('chunks')
  function Data() {
    var selfself = this
    this.chunksLoaded = 0
    this.pendingChunks = 0
    this.voxels = 0
    this.update = function() {
      selfself.chunksLoaded = Object.keys(self.game.voxels.chunks).length
      selfself.pendingChunks = self.game.pendingChunks.length
      // TODO: maybe make this less stupid?
      selfself.voxels = selfself.chunksLoaded * self.game.chunkSize * self.game.chunkSize * self.game.chunkSize
    }
    self._datum.push(this)
  }
  var d = new Data()
  folder.add(d, 'chunksLoaded')
  folder.add(d, 'pendingChunks')
  folder.add(d, 'voxels')
}

Debug.prototype._render = function() {
  var self = this
  var folder = this.folder.addFolder('render')
  this.mesherName = 'greedy'
  folder.add(this, 'mesherName', ['greedy', 'culled']).onChange(function(value) {
    self.game.mesher = require('voxel').meshers[value]
    self.game.showAllChunks()
  })

  folder.add(this.game, 'meshType', ['surfaceMesh', 'wireMesh']).onChange(function(value) {
    // refresh chunks on change
    self.game.showAllChunks() 
  })
}
