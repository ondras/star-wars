Game.Display = function(options) {
	var options = {
		fontSize: 100,
		fontFamily: "droid sans mono, monospace",
		spacing: 1.1,
		width: 1,
		height: 1,
		fg: "#aaa"
	}
	ROT.Display.call(this, options);
	this._ratio = this._charWidth / options.fontSize; /* measure ratio */

	this._offset = [0, 0]; /* cell in left-top of canvas */
	this._canvas.style.position = "relative";

	this._options.width = 62;
	this._options.height = Game.Rules.TARGET_KILLS + 1;

	this._effects = {};
	this._decals = {};
	this._bubble = null;
	this._status = "";

	this._resize();

	window.addEventListener("resize", this);
}
Game.Display.extend(ROT.Display);

Game.Display.prototype.update = function(x, y) {
	var ox = x-this._offset[0];
	var oy = y-this._offset[1];

	if (ox <= 0 || ox >= this._options.width-1) { return; }
	if (oy < 0 || oy >= this._options.height-1) { return; }
	
	var key = x+","+y;

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

Game.Display.prototype.getOffset = function() {
	return this._offset;
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

Game.Display.prototype.showBubble = function(bubble) {
	this._bubble = bubble;
	this._dirty = true;
}

Game.Display.prototype.setStatus = function(status) {
	this._status = status;
	this.setCenter(); /* redraw all */
}

Game.Display.prototype.setCenter = function() {
	var pos = Game.player.getPosition();
	this._offset[0] = pos[0]-Math.floor((this._options.width-2)/2);
	this._offset[1] = pos[1]-Math.floor((this._options.height-1)/2);

	this.clear();

	for (var i=1;i<this._options.width-1;i++) {
		for (var j=0;j<this._options.height-1;j++) {
			this.update(i+this._offset[0], j+this._offset[1]);
		}
	}

	this.updateStats();
	this.updateScore();

	this.drawText(0, this._options.height-1, this._status);
}

Game.Display.prototype.updateStats = function() {
	var half = Math.floor((this._options.height-1)/2);

	var hp = Game.player.getHPFraction() * half;
	for (var i=0;i<half;i++) {
		var y = half - 1 - i;
		var ch = (hp > i ? "♥" : "♡");
		this.draw(0, y, ch, Game.COLOR_HEALTH);
	}

	var mana = Game.player.getManaFraction() * half;
	for (var i=0;i<half;i++) {
		var y = half + i;
		var ch = (mana > i ? "●" : "○");
		this.draw(0, y, ch, Game.COLOR_MANA);
	}
}

Game.Display.prototype.updateScore = function() {
	var score = Game.tutorial.getScore();
	var x = this._options.width-1;
	for (var i=0; i<this._options.height-1; i++) {
		var ch = (score > i ? "■" : "□");
		this.draw(x, this._options.height-i-2, ch, Game.COLOR_SCORE);
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
			var x = parseInt(parts[0]);
			var y = parseInt(parts[1]);

			/* x a y jsou absolutni souradnice herniho sveta */
			var shouldUpdate = true;

			if (this._bubble) { 
				var relX = x-this._offset[0];
				var relY = y-this._offset[1];
				/* pokud je to v bubline, pak neupdatujeme */
				if (relX+","+relY in this._bubble.getCells()) { shouldUpdate = false; }
			}

			if (shouldUpdate) { this.update(x, y); }
		}
	}

	ROT.Display.prototype._tick.call(this);
}

Game.Display.prototype._draw = function(key, clearBefore) {
	if (this._bubble && !(key in this._bubble.getCells())) { this._context.globalAlpha = 0.4; }
	var result = ROT.Display.prototype._draw.call(this, key, clearBefore);
	this._context.globalAlpha = 1;
	return result;
}

Game.Display.prototype._drawTerrain = function(x, y) {
	var ox = x - this._offset[0];
	var oy = y - this._offset[1];
	var terrain = Game.terrain.get(x, y);
	switch (terrain) {
		case Game.Terrain.TYPE_ROCK:
			this.draw(ox, oy, "*", "#ccc");
		break;

		case Game.Terrain.TYPE_TREE:
			this.draw(ox, oy, "T", "#090");
		break;

		case Game.Terrain.TYPE_LAND:
			this.draw(ox, oy, "·", "#960");
		break;
	}

}
