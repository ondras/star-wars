Game.Terrain = function() {
	this._noise = new ROT.Noise.Simplex();
	this._dirs = ROT.DIRS[8];

	this._wallThreshold = 0.3;
	this._treeThreshold = -0.6;
	
	this._cached = {};
}

Game.Terrain.TYPE_NONE		= 0;
Game.Terrain.TYPE_LAND		= 1;
Game.Terrain.TYPE_TREE		= 2;
Game.Terrain.TYPE_WALL		= 3;

/**
 * @returns {object} Keys: type, 
 */
Game.Terrain.prototype.get = function(x, y) {
	var key = x+","+y;
	if (key in this._cached) { return this._cached[key]; }
	
	if (this._isLand(x, y)) { return Game.Terrain.TYPE_LAND; }
	
	var noise = this._noise.get(x/30, y/20);
	if (noise > this._wallThreshold) {
		/* if any of the neighbors is land, return wall */
		for (var i=0;i<this._dirs.length;i++) {
			var tx = x + this._dirs[i][0];
			var ty = y + this._dirs[i][1];
			if (this._isLand(tx, ty)) {
				this._cached[key] = Game.Terrain.TYPE_WALL;
				return Game.Terrain.TYPE_WALL;
			}
		}
	}
	
	if (noise < this._treeThreshold) {
		return Game.Terrain.TYPE_TREE;
	}
	
	return Game.Terrain.TYPE_NONE;
}

Game.Terrain.prototype.set = function(x, y, type) {
	this._cached[x+","+y] = type;
	return this;
}

Game.Terrain.prototype._isLand = function(x, y) {
	var key = x+","+y;
	if (key in this._cached) { return this._cached[key] == Game.Terrain.TYPE_LAND; }
	
	var noise = this._noise.get(x/30, y/20);
	if (noise <= this._wallThreshold && noise >= this._treeThreshold) {
		this._cached[key] = Game.Terrain.TYPE_LAND;
		return true;
	} else {
		return false;
	}
}
