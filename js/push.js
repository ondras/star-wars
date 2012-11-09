/**
 * Force push
 */
Game.Push = function(being, direction) {
	this._start = being.getPosition();
	this._currentRow = null;
	this._cells = Game.generateCellArc(this._start[0], this._start[1], direction);
	this._chars = ["/", "−", "\\", "|"];

	Game.engine.lock();

	this._pushBeings();
	this._step();
}
Game.Push.DELAY = 50;

Game.Push.prototype._pushBeings = function() {
/* FIXME */
}

Game.Push.prototype._step = function() {
	if (this._currentRow) { /* remove previous */
		while (this._currentRow.length) {
			var pos = this._currentRow.pop();
			Game.display.removeEffect(pos[0], pos[1]);
		}
	}

	if (!this._cells.length) {
		this._done();
		return;
	}

	this._currentRow = this._cells.shift();
	for (var i=0;i<this._currentRow.length;i++) {
		var pos = this._currentRow[i];	
		var dx = pos[0]-this._start[0];
		var dy = pos[1]-this._start[1];

		var ch = Game.directionToChar(dx, dy, this._chars);
		Game.display.setEffect(pos[0], pos[1], ch, "#aaf");
	}
	
	setTimeout(this._step.bind(this), this.constructor.DELAY);
}

Game.Push.prototype._done = function() {
	Game.engine.unlock();
}
