Game.Terrain = function() {
	this._noise = new ROT.Noise.Simplex();

	this._rockThreshold = 0.6;
	this._treeThreshold = -0.6;
	this._forced = {};
}

Game.Terrain.TYPE_NONE		= 0;
Game.Terrain.TYPE_LAND		= 1;
Game.Terrain.TYPE_TREE		= 2;
Game.Terrain.TYPE_ROCK		= 3;

/**
 * @returns {int}
 */
Game.Terrain.prototype.get = function(x, y) {
	var key = x+","+y;
	if (key in this._forced) { return this._forced[key]; }

	var noise = this._noise.get(x/30, y/20);
	if (noise < this._treeThreshold) {
		return Game.Terrain.TYPE_TREE;
	} else if (noise > this._rockThreshold) {
		return Game.Terrain.TYPE_ROCK;
	} else {
		return Game.Terrain.TYPE_LAND;
	}
}

Game.Terrain.prototype.set = function(x, y, type) {
	this._forced[x+","+y] = type;
	Game.display.update(x, y);
	return this;
}
