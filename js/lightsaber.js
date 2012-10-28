/**
 * One swing with a lightsaber
 */
Game.Lightsaber = function(being) {
	this._being = being;
	this._dir = -1;
	this._chars = ["|", "/", "−", "\\"];

	Game.engine.lock();
	this._step();
}

Game.Lightsaber.DAMAGE = 5;
Game.Lightsaber.DELAY = 50;

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
	var ch = this._chars[this._dir % this._chars.length];
	var key = (pos[0]+dir[0]) + "," + (pos[1]+dir[1]);
	var being = Game.beings[key];
	if (being) {
		being.adjustHP(-this.constructor.DAMAGE);
	}
	
	Game.display.setEffect(pos[0]+dir[0], pos[1]+dir[1], ch, "red");
	setTimeout(this._step.bind(this), this.constructor.DELAY);
}

Game.Lightsaber.prototype._done = function() {
	Game.engine.unlock();
}
