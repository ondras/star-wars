/**
 * One shot with a laser blaster
 */
Game.Blaster = function(being, x, y, deflect) {
	Game.audio.play(deflect ? "deflect" : "blaster");

	this._trajectory = [];
	this._char = "";
	this._current = null;

	Game.engine.lock();
	
	var pos = being.getPosition();
	this._compute(pos[0], pos[1], x, y);
	this._step();
}

Game.Blaster.COLOR = "#f00";
Game.Blaster.DELAY = 100;
Game.Blaster.DECAL_DELAY = 1000;

Game.Blaster.prototype._compute = function(sx, sy, tx, ty) {
	var dx = tx-sx;
	var dy = ty-sy;
	this._char = Game.directionToChar(dx, dy, ["\\", "|", "/", "−"]);
	
	if (Math.abs(dx) > Math.abs(dy)) {
		var len = Math.abs(dx);
		var diff = dy/len;
		dx /= len;
		for (var i=1;i<=len;i++) {
			var x = sx + i*dx;
			var y = Math.round(sy + i*diff);
			this._trajectory.push([x, y]);
		}
	} else {
		var len = Math.abs(dy);
		var diff = dx/len;
		dy /= len;
		for (var i=1;i<=len;i++) {
			var x = Math.round(sx + i*diff);
			var y = sy + i*dy;
			this._trajectory.push([x, y]);
		}
	}
}

Game.Blaster.prototype._step = function() {
	if (this._current) { /* remove previous */
		Game.display.removeEffect(this._current[0], this._current[1]);
	}
	
	if (!this._trajectory.length) {
		this._done();
		return;
	}
	
	var ch = this._char;

	this._current = this._trajectory.shift();
	var key = (this._current[0]) + "," + (this._current[1]);
	var being = Game.beings[key];
	if (being) {

		/* deflect? */
		if (being instanceof Game.SaberUser) {
			if (ROT.RNG.getUniform() > Game.Rules.BLASTER_DEFLECT_CHANCE) { /* deflect successful! */
				var target = Game.getBeingsInDistance(this._current[0], this._current[1], Game.Rules.BLASTER_RANGE).random();
				var pos = target.getPosition();
				new Game.Blaster(being, pos[0], pos[1], true);
				Game.engine.unlock();
				return;
			}
		}

		/* not deflected, damage */
		being.damage(Game.Rules.BLASTER_DAMAGE);
		ch = "*";
	} else {
		var terrain = Game.terrain.get(this._current[0], this._current[1]);
		switch (terrain) {
			case Game.Terrain.TYPE_ROCK:
				ch = "*";
				Game.display.setDecal(this._current[0], this._current[1], "*", "#666", this.constructor.DECAL_DELAY);
			break;

			case Game.Terrain.TYPE_TREE:
				ch = "*";
				Game.terrain.set(this._current[0], this._current[1], Game.Terrain.TYPE_LAND);
			break;
		}
	}
	
	if (ch == "*") { this._trajectory = []; } /* end of shot */
	
	Game.display.setEffect(this._current[0], this._current[1], ch, this.constructor.COLOR);
	setTimeout(this._step.bind(this), this.constructor.DELAY);
}

Game.Blaster.prototype._done = function() {
	Game.engine.unlock();
}
