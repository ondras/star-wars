Game.Player = function() {
	Game.Being.call(this);
	
	this._alive = true;
	this._name = "you";

	this._movementKeys = {};

	this._movementKeys[104]	= 0;
	this._movementKeys[105]	= 1;
	this._movementKeys[102]	= 2;
	this._movementKeys[99]	= 3;
	this._movementKeys[98]	= 4;
	this._movementKeys[97]	= 5;
	this._movementKeys[100]	= 6;
	this._movementKeys[103]	= 7;
	
	this._movementKeys[37] = 6;
	this._movementKeys[38] = 0;
	this._movementKeys[39] = 2;
	this._movementKeys[40] = 4;

	this._movementKeys[101]	= -1; /* noop */
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

	if (code in this._movementKeys) { 
		this._tryMovement(this._movementKeys[code]);
		return; 
	}
	
	var used = true;
	switch (String.fromCharCode(code)) {
		case "S":
			this._lightsaber();
		break;
		
		default:
			used = false;
		break;
	}
	
	if (used) { 
		window.removeEventListener("keydown", this); 
		Game.engine.unlock();
	}
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

Game.Player.prototype._tryMovement = function(direction) {
	if (direction == -1) { /* noop */
		window.removeEventListener("keydown", this);
		Game.engine.unlock();
		return;
	}

	var dir = ROT.DIRS[8][direction];
	var x = this._position[0] + dir[0];
	var y = this._position[1] + dir[1];

	if (x+","+y in Game.beings) { /* occupied */
		Game.log("That place is already occupied!");
		return;
	}

	/* move */
	Game.setBeing(x, y, this);
	window.removeEventListener("keydown", this);
	Game.engine.unlock();
}

Game.Player.prototype._lightsaber = function() {
	new Game.Lightsaber(this);
}
