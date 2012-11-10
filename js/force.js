/**
 * Force movement
 */
Game.Force = function(being, direction, method, order, forceMin, forceMax) {
	this._start = being.getPosition();
	this._cells = Game.generateCellArc(this._start[0], this._start[1], direction);
	this._method = method;
	this._order = order;
	this._forceMin = forceMin;
	this._forceMax = forceMax;

	this._currentRowIndex = null;
	this._chars = ["/", "−", "\\", "|"];

	Game.engine.lock();

	this._step();
}
Game.Force.DELAY = 50;

Game.Force.prototype._applyToBeings = function() {
	var max = this._cells.length-1;
	var forceDiff = this._forceMax - this._forceMin;

	for (var i=0; i<=max; i++) {
		var index = (this._order == 1 ? max-i : i);
		var force = this._forceMax - Math.round(forceDiff * index/max);

		var row = this._cells[index];
		for (var j=0;j<row.length;j++) {
			var key = row[j][0]+","+row[j][1];
			var being = Game.beings[key];
			if (!being) { continue; }

			being[this._method](this._start[0], this._start[1], force);
		}
	}
}

Game.Force.prototype._step = function() {
	if (this._currentRowIndex !== null) { /* remove previous */
		var currentRow = this._cells[this._currentRowIndex];
		for (var i=0;i<currentRow.length;i++) {
			var pos = currentRow[i];
			Game.display.removeEffect(pos[0], pos[1]);
		}
	}
	
	/* adjust */
	if (this._currentRowIndex === null) {
		this._currentRowIndex = (this._order == 1 ? 0 : this._cells.length-1);
	} else {
		this._currentRowIndex += this._order;
	}
	
	if (this._currentRowIndex == Math.floor(this._cells.length/2)) {
		this._applyToBeings();
	}
	
	/* nothing to do */
	if (!this._cells[this._currentRowIndex]) {
		this._done();
		return;
	}
	
	/* draw current */
	var currentRow = this._cells[this._currentRowIndex];
	for (var i=0;i<currentRow.length;i++) {
		var pos = currentRow[i];	
		var dx = pos[0]-this._start[0];
		var dy = pos[1]-this._start[1];

		var ch = Game.directionToChar(dx, dy, this._chars);
		Game.display.setEffect(pos[0], pos[1], ch, "#aaf");
	}
	
	setTimeout(this._step.bind(this), Game.Force.DELAY);
}

Game.Force.prototype._done = function() {
	Game.engine.unlock();
}
