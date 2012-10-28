Game.Display = function(options) {
	var options = {
		fontSize: 100,
		fontFamily: "droid sans mono, monospace",
		spacing: 1.1,
		width: 1,
		height: 1
	}
	ROT.Display.call(this, options);
	this._ratio = this._charWidth / options.fontSize; /* measure ratio */

	this._offset = [0, 0]; /* cell in left-top of canvas */
	this._canvas.style.position = "relative";

	this._options.width = 60;
	this._options.height = 25;

	this._effects = {};
	this._decals = {};

	this._resize();

	window.addEventListener("resize", this);
}
Game.Display.extend(ROT.Display);

Game.Display.prototype.update = function(x, y) {
	/* FIXME visibility? asi ne */
	var key = x+","+y;
	var ox = x-this._offset[0];
	var oy = y-this._offset[1];
	
	var effect = this._effects[key];
	if (effect) {
		this.draw(ox, oy, effect[0], effect[1]);
		return;
	}

	var being = Game.beings[key];
	if (being) {
		this.draw(ox, oy, being.getChar(), being.getColor());
		return;
	}
	
	var decal = this._decals[key];
	if (decal) {
		this.draw(ox, oy, decal[0], decal[1]);
		return;
	}

	this._drawTerrain(x, y);
}

Game.Display.prototype.setEffect = function(x, y, ch, color) {
	this._effects[x+","+y] = [ch, color];
	this.update(x, y);
}

Game.Display.prototype.removeEffect = function(x, y) {
	delete this._effects[x+","+y];
	this.update(x, y);
}

Game.Display.prototype.setDecal = function(x, y, ch, color, delay) {
	this._decals[x+","+y] = [ch, color, Date.now() + delay];
	this.update(x, y);
}

Game.Display.prototype.setCenter = function() {
	var pos = Game.player.getPosition();
	this._offset[0] = pos[0]-Math.floor(this._options.width/2);
	this._offset[1] = pos[1]-Math.floor(this._options.height/2);

	this.clear();

	for (var i=0;i<this._options.width;i++) {
		for (var j=0;j<this._options.height;j++) {
			this.update(i+this._offset[0], j+this._offset[1]);
		}
	}

}

Game.Display.prototype.handleEvent = function(e) {
	this._resize();
}

Game.Display.prototype._resize = function() {
	var w = window.innerWidth;
	var h = window.innerHeight;

	var boxWidth = Math.floor(w / this._options.width);
	var boxHeight = Math.floor(h / this._options.height);
	
	var widthFraction = this._ratio * boxHeight / boxWidth;
	if (widthFraction > 1) { /* too wide with current aspect ratio */
		boxHeight = Math.floor(boxHeight / widthFraction);
	}
	
	var fontSize = Math.floor(boxHeight / this._options.spacing);

	this.setOptions({fontSize:fontSize});
	this._canvas.style.top = Math.round((h-this._canvas.height)/2) + "px";
}

Game.Display.prototype._tick = function() {
	var now = Date.now();
	for (var key in this._decals) {
		var decal = this._decals[key];
		if (now > decal[2]) {
			delete this._decals[key];
			var parts = key.split(",");
			this.update(parseInt(parts[0]), parseInt(parts[1]));
		}
	}

	ROT.Display.prototype._tick.call(this);
}

Game.Display.prototype._drawTerrain = function(x, y) {
	var ox = x - this._offset[0];
	var oy = y - this._offset[1];
	var terrain = Game.terrain.get(x, y);
	switch (terrain) {
		case Game.Terrain.TYPE_WALL:
			this.draw(ox, oy, "#", "#ccc");
		break;

		case Game.Terrain.TYPE_TREE:
			this.draw(ox, oy, "T", "#090");
		break;

		case Game.Terrain.TYPE_LAND:
			this.draw(ox, oy, "·", "#960");
		break;
	}

}
