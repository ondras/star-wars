Game.Terrain = function() {
	this._noise = new ROT.Noise.Simplex();

	this._mountainThreshold = 0.3;
	this._forestThreshold = -0.3;
}

Game.Terrain.TYPE_LAND		= 0;
Game.Terrain.TYPE_MOUNTAIN	= 1;
Game.Terrain.TYPE_FOREST	= 2;

/**
 * @returns {object} Keys: type, 
 */
Game.Terrain.prototype.get = function(x, y) {
	var result = {};

	var noise = this._noise.get(x/30, y/20);
	if (noise > this._mountainThreshold) {
		result.type = Game.Terrain.TYPE_MOUNTAIN;
		result.amount = (noise-this._mountainThreshold) / (1-this._mountainThreshold);
	} else if (noise < this._forestThreshold) {
		result.type = Game.Terrain.TYPE_FOREST;
		result.amount = -(noise-this._forestThreshold) / (1+this._forestThreshold);
	} else {
		result.type = Game.Terrain.TYPE_LAND;
		result.amount = (noise-this._forestThreshold) / (this._mountainThreshold-this._forestThreshold);
	}

	
	return result;
}
