# voxel-debug

Debug helpers for [voxel.js](http://voxeljs.org) using [dat-gui](http://workshop.chromeexperiments.com/examples/gui/).

## example

[View this example](http://shama.github.io/voxel-debug)

```js
// Loads a dat-gui in the top right with settings
var debug = require('voxel-debug')(game)

// Add a x,y,z axis at center of game and 10 voxels big
debug.axis([0, 0, 0], 10)
```

You may want to add to your own settings to the dat-gui controls. Install [dat-gui](http://npmjs.org/dat-gui) with `npm install dat-gui` and configure as such:

```js
var gui = new (require('dat-gui')).GUI()
var debug = require('voxel-debug')({
  game: game,
  gui: gui
})

// Create a folder and add position properties for a fictious item
var folder = gui.addFolder('Item Position')
folder.add(item.position, 'x')
folder.add(item.position, 'y')
folder.add(item.position, 'z')
```

Please goto [http://workshop.chromeexperiments.com/examples/gui/](http://workshop.chromeexperiments.com/examples/gui/) for more examples on using dat-gui.

**Please open a PR to add more useful default debug properties!**

## api

### `var createDebug = require('voxel-debug')`
Returns a function to create a debugger:

```js
var debug = createDebug({game: game, gui: gui})
```

#### `debug.axis([position, size])`
Displays a new axis at `position` and with `size`. Returns the `AxisHelper`.

#### `debug.open()`
Opens all the folders.

#### `debug.close()`
Closes all the folders.

## install

With [npm](https://npmjs.org) do:

```
npm install voxel-debug
```

Use [browserify](http://browserify.org) to `require('voxel-debug')`.

## release history
* 0.2.0 - Add open/close methods
* 0.1.0 - initial release

## license
Copyright (c) 2013 Kyle Robinson Young<br/>
Licensed under the MIT license.
