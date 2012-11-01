Game.Terrain = function() {
	this._noise = new ROT.Noise.Simplex();
	this._buildingSeed = ROT.RNG.getUniform();

	this._treeThreshold = -0.6;
}

Game.Terrain.TYPE_NONE		= 0;
Game.Terrain.TYPE_LAND		= 1;
Game.Terrain.TYPE_TREE		= 2;
Game.Terrain.TYPE_WALL		= 3;

/**
 * @returns {int}
 */
Game.Terrain.prototype.get = function(x, y) {
	var tileSize = [10, 10];
	var tileX = Math.floor(x/tileSize[0]);
	var tileY = Math.floor(y/tileSize[1]);
	
	var centerX = tileX*tileSize[0] + tileSize[0]/2;
	var centerY = tileY*tileSize[1] + tileSize[1]/2;
	
	var dist = Math.max(Math.abs(centerX - x), Math.abs(centerY - y));
	if (dist == 3) {
		return Game.Terrain.TYPE_WALL;
	} else if (dist < 3) {
		return Game.Terrain.TYPE_NONE;
	} else {
		var noise = this._noise.get(x/30, y/20);
		if (noise < this._treeThreshold) { return Game.Terrain.TYPE_TREE; }
	}
	
	return Game.Terrain.TYPE_LAND;
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
