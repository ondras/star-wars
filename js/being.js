Game.Being = function() {
	this._position = null;
	this._name = "";
	this._speed = 100;
	this._hp = 1;
	this._color = "";
	this._char = "?";
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

Game.Being.prototype.adjustHP = function(diff) {
	this._hp = Math.max(0, this._hp + diff);
	if (!this._hp) { this.die(); }
	return this;
}

Game.Being.prototype.die = function() {
	this._splat();
	Game.removeBeing(this);
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
