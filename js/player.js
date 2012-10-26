Game.Player = function() {
	Game.Being.call(this);
	
	this._alive = true;
	this._name = "you";

	this._keys = {};

	this._keys[104]	= 0;
	this._keys[105]	= 1;
	this._keys[102]	= 2;
	this._keys[99]	= 3;
	this._keys[98]	= 4;
	this._keys[97]	= 5;
	this._keys[100]	= 6;
	this._keys[103]	= 7;

	this._keys[101]	= -1; /* noop */
}
Game.Player.extend(Game.Being);

Game.Player.prototype.act = function() {
	Game.engine.lock();
	
	if (this._alive) {
		window.addEventListener("keydown", this); /* wait for input */
	} else {
		alert("Game over");
	}
}

Game.Player.prototype.handleEvent = function(e) {
	var code = e.keyCode;

	if (!(code in this._keys)) { return; } /* not a direction/noop */
	if (e.ctrlKey) { return; }
	
	e.preventDefault();
	code = this._keys[code];

	var dir = (code == -1 ? [0,0] : ROT.DIRS[8][code]);
	var x = this._position[0] + dir[0];
	var y = this._position[1] + dir[1];

	if (code == -1) { /* noop */
		window.removeEventListener("keydown", this);
		Game.engine.unlock();
		return;
	}
	this._tryMove(x, y);
}

Game.Player.prototype.getChar = function() {
	return "@";
}

Game.Player.prototype.getColor = function() {
	return "#ccc";
}

Game.Player.prototype.die = function() {
	Game.Being.prototype.die.call(this);
	this._alive = false;
}

Game.Player.prototype._tryMove = function(x, y) {
	if (x+","+y in Game.beings) { /* occupied */
		Game.log("That place is already occupied!");
		return;
	}

	/* move */
	Game.setBeing(x, y, this);
	window.removeEventListener("keydown", this);
	Game.engine.unlock();
}
