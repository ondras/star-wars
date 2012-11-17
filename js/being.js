Game.Being = function() {
	this._position = null;
	this._name = "";
	this._speed = 100;
	this._hp = 1;
	this._mana = 0;
	this._color = "";
	this._char = "?";
	this._deathSound = "death";
	this._stunned = false;
	this._remains = ["%", "&", "~"];
	this._remainsColor = "red";
}

Game.Being.REMAINS_DELAY = 1000;

Game.Being.prototype.getColor = function() {
	return this._color;
}

Game.Being.prototype.getChar = function() {
	return this._char;
}

Game.Being.prototype.getSpeed = function() {
	return this._speed;
}

Game.Being.prototype.getName = function() {
	return this._name;
}

Game.Being.prototype.setPosition = function(x, y) {
	this._position = (x === null ? null : [x, y]);
	return this;
}

Game.Being.prototype.getPosition = function() {
	return this._position;
}

Game.Being.prototype.act = function() {
}

Game.Being.prototype.damage = function(amount) {
	this.adjustHP(-amount);
}

Game.Being.prototype.adjustHP = function(diff) {
	this._hp = Math.max(0, this._hp + diff);
	if (!this._hp) { this.die(); }
	return this;
}

Game.Being.prototype.adjustMana = function(diff) {
	this._mana = Math.max(0, this._mana + diff);
	return this;
}

Game.Being.prototype.die = function() {
	Game.audio.play(this._deathSound);
	this._splat();
	Game.removeBeing(this);
}

Game.Being.prototype.stun = function() {
	this._stunned = true;
}

/**
 * Push this being from a push point with a given force
 * @param {int} force
 * @param {int} x
 * @param {int} y
 */
Game.Being.prototype.push = function(force, x, y) {
	this.stun();
	var startX = this._position[0];
	var startY = this._position[1];
	var angle = Math.atan2(startY-y, startX-x);

	for (var i=1; i<=force; i++) {
		var testx = startX + Math.round(i*Math.cos(angle));
		var testy = startY + Math.round(i*Math.sin(angle));
		var key = testx+","+testy;
		if (key in Game.beings) { return; } /* stop, another being in the way */

		var terrain = Game.terrain.get(testx, testy);
		if (terrain == Game.Terrain.TYPE_LAND) { /* slide backwards */
			Game.setBeing(testx, testy, this);
		} else { /* damage by terrain */
			this.damage(Game.Rules.PUSH_DAMAGE);
			return;
		}
	}

}

/**
 * Pull this being from a pull point with a given force
 * @param {int} force
 * @param {int} x
 * @param {int} y
 */
Game.Being.prototype.pull = function(force, x, y) {
	this.stun();
	var startX = this._position[0];
	var startY = this._position[1];
	var angle = Math.atan2(startY-y, startX-x);

	for (var i=1; i<=force; i++) {
		var testx = startX - Math.round(i*Math.cos(angle));
		var testy = startY - Math.round(i*Math.sin(angle));
		var key = testx+","+testy;
		if (key in Game.beings) { return; } /* stop, another being in the way */

		var terrain = Game.terrain.get(testx, testy);
		if (terrain == Game.Terrain.TYPE_LAND) { /* slide towards the pullpoint */
			Game.setBeing(testx, testy, this);
		}
	}

}

Game.Being.prototype._isPassable = function(x, y) {
	var key = x+","+y;
	if (key in Game.beings) { return false; }

	var terrain = Game.terrain.get(x, y);
	return (terrain == Game.Terrain.TYPE_LAND);
}

Game.Being.prototype.distance = function(x, y) {
	return Math.max(Math.abs(x-this._position[0]), Math.abs(y-this._position[1]));
}

Game.Being.prototype._getToDistance = function(optimalDistance, x, y) {
	var avail = [];
	var bestDistance = null;
	var pos = this._position;

	for (var i=0;i<ROT.DIRS[8].length;i++) {
		var tx = pos[0] + ROT.DIRS[8][i][0];
		var ty = pos[1] + ROT.DIRS[8][i][1];
		if (!this._isPassable(tx, ty)) { continue; }

		var dist = Math.max(Math.abs(x-tx), Math.abs(y-ty));
		if (bestDistance === null || Math.abs(dist - optimalDistance) < Math.abs(bestDistance - optimalDistance)) {
			bestDistance = dist;
			avail = []; 
		}

		if (dist == bestDistance) { avail.push(i); }
	}

	if (avail.length) {
		var dir = ROT.DIRS[8][avail.random()];
		Game.setBeing(pos[0]+dir[0], pos[1]+dir[1], this);
		return true;
	} else {
		return false;
	}

}

/**
 * Random movement
 */
Game.Being.prototype._wander = function(x, y) {
	var avail = [];
	var pos = this._position;
	
	for (var i=0;i<ROT.DIRS[8].length;i++) {
		var tx = pos[0] + ROT.DIRS[8][i][0];
		var ty = pos[1] + ROT.DIRS[8][i][1];
		if (!this._isPassable(tx, ty)) { continue; }
		avail.push(i);
	}

	if (avail.length) {
		var dir = ROT.DIRS[8][avail.random()];
		Game.setBeing(pos[0]+dir[0], pos[1]+dir[1], this);
		return true;
	} else {
		return false;
	}
}

Game.Being.prototype._splat = function() {
	var dirs = [[0, 0]];
	for (var i=0;i<ROT.DIRS[8].length;i++) { dirs.push(ROT.DIRS[8][i]); }

	while (dirs.length) {
		var dir = dirs.pop();
		/* do not skip if the last (center) dir is being considered */
		if (dirs.length && ROT.RNG.getUniform() > 0.4) { continue; }
		
		var ch = this._remains.random();
		var x = this._position[0] + dir[0];
		var y = this._position[1] + dir[1];
		var delay = Game.Being.REMAINS_DELAY * (1+ROT.RNG.getUniform());
		Game.display.setDecal(x, y, ch, this._remainsColor, delay);
	}
}
