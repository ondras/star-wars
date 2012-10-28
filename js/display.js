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
	this._drawCell(x, y, false);
}

Game.Display.prototype.setEffect = function(x, y, ch, color) {
	this._effects[x+","+y] = [ch, color];
	var f = this._context.font;
	this._context.font = "bold " + f;
	this.update(x, y);
	this._context.font = f;
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
			this._drawCell(i+this._offset[0], j+this._offset[1], true);
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

/**
 * @param {int} x
 * @param {int} y
 * @param {bool} doNotClear
 */
Game.Display.prototype._drawCell = function(x, y, doNotClear) {
	var key = x+","+y;
	var ox = x-this._offset[0];
	var oy = y-this._offset[1];
	
	var effect = this._effects[key];
	if (effect) {
		this.draw(ox, oy, effect[0], effect[1], doNotClear ? "transparent" : "");
		return;
	}

	var being = Game.beings[key];
	if (being) {
		this.draw(ox, oy, being.getChar(), being.getColor(), doNotClear ? "transparent" : "");
		return;
	}
	
	var decal = this._decals[key];
	if (decal) {
		this.draw(ox, oy, decal[0], decal[1], doNotClear ? "transparent" : "");
		return;
	}

	this._drawTerrain(x, y, doNotClear);
}

Game.Display.prototype._drawTerrain = function(x, y, doNotClear) {
	var terrain = Game.terrain.get(x, y);
	switch (terrain.type) {
		case Game.Terrain.TYPE_MOUNTAIN:
			ch = "^";
			var colors = ["#d99", "#ff3", "#ccc", "#fff"];
			color = colors[Math.floor(terrain.amount * colors.length)];
		break;

		case Game.Terrain.TYPE_FOREST:
			var chars = ["t", "T"];
			ch = chars[Math.floor(terrain.amount * chars.length)];
			color = "#090";
		break;

		case Game.Terrain.TYPE_LAND:
			ch = "·";
			var colors = ["#666", "#960"];
			color = colors[Math.floor(terrain.amount * colors.length)];
		break;
	}

	this.draw(x-this._offset[0], y-this._offset[1], ch, color, doNotClear ? "transparent" : "");
}
