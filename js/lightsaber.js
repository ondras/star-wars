/**
 * One swing with a lightsaber
 */
Game.Lightsaber = function(being, color) {
	Game.audio.play("saber");
	this._being = being;
	this._dir = -1;
	this._chars = ["|", "/", "−", "\\"];
	this._color = color;
	this._promise = new Promise();
}

Game.Lightsaber.DELAY = 50;
Game.Lightsaber.DECAL_DELAY = 1000;

Game.Lightsaber.prototype.go = function() {
	this._step();
	return this._promise;
}

Game.Lightsaber.prototype._step = function() {
	var pos = this._being.getPosition();

	if (this._dir > -1) { /* remove previous */
		var dir = ROT.DIRS[8][this._dir % 8];
		Game.display.removeEffect(pos[0]+dir[0], pos[1]+dir[1]);
	}
	
	this._dir++;
	
	if (this._dir == 9) {
		this._done();
		return;
	}
	
	var dir = ROT.DIRS[8][this._dir % 8];
	var x = pos[0]+dir[0];
	var y = pos[1]+dir[1];
	var ch = this._chars[this._dir % this._chars.length];
	var key = x+","+y;
	var being = Game.beings[key];

	if (being) {
		being.damage(Game.Rules.SABER_DAMAGE);
	} else {
		var terrain = Game.terrain.get(x, y)
		switch (terrain) {
			case Game.Terrain.TYPE_TREE:
				Game.terrain.set(x, y, Game.Terrain.TYPE_LAND);
			break;

			case Game.Terrain.TYPE_ROCK:
				Game.display.setDecal(x, y, "*", "#666", this.constructor.DECAL_DELAY);
			break;
		}
	}

	
	Game.display.setEffect(pos[0]+dir[0], pos[1]+dir[1], ch, this._color);
	setTimeout(this._step.bind(this), this.constructor.DELAY);
}

Game.Lightsaber.prototype._done = function() {
	this._promise.fulfill();
}
