Game.Player = function(type) {
	Game.SaberUser.call(this, type);
	
	this._name = "you";
	this._char = "@";
	this._pendingDirection = null;

	this._maxHP = Game.Rules.HP_PLAYER;
	this._hp = this._maxHP;

	this._maxMana = Game.Rules.MANA_PLAYER;
	this._mana = this._maxMana;

	this._powers = {
		lightsaber: false,
		push: false,
		pull: false,
		fork: false
	}
	
	this._movementKeys = {};

	/*H(72) J(74) K(75) L(76)*/
	/*B(66) N(78) U(85) Y(89)*/
	this._movementKeys[75]	= 0;
	this._movementKeys[85]	= 1;
	this._movementKeys[76]	= 2;
	this._movementKeys[78]	= 3;
	this._movementKeys[74]	= 4;
	this._movementKeys[66]	= 5;
	this._movementKeys[72]	= 6;
	this._movementKeys[89]	= 7;

	this._movementKeys[104]	= 0;
	this._movementKeys[105]	= 1;
	this._movementKeys[102]	= 2;
	this._movementKeys[99]	= 3;
	this._movementKeys[98]	= 4;
	this._movementKeys[97]	= 5;
	this._movementKeys[100]	= 6;
	this._movementKeys[103]	= 7;
	
	this._movementKeys[12]	= -1;
	this._movementKeys[101]	= -1;
	this._movementKeys[190]	= -1;
	
	/*NumPad Controls*/
	this._movementKeys[38] = 0;
	this._movementKeys[33] = 1;
	this._movementKeys[39] = 2;
	this._movementKeys[34] = 3;
	this._movementKeys[40] = 4;
	this._movementKeys[35] = 5;
	this._movementKeys[37] = 6;
	this._movementKeys[36] = 7;
}
Game.Player.extend(Game.SaberUser);

Game.Player.prototype.adjustPowers = function(obj) {
	for (var p in obj) { this._powers[p] = obj[p]; }
	this._buildStatus();
}

Game.Player.prototype.getHPFraction = function() {
	return this._hp/this._maxHP;
}

Game.Player.prototype.getManaFraction = function() {
	return this._mana/this._maxMana;
}

Game.Player.prototype.act = function() {
	Game.engine.lock();
	window.addEventListener("keydown", this); /* wait for input */
}

Game.Player.prototype.handleEvent = function(e) {
	var code = e.keyCode;
	
	if (this._pendingDirection) {
		var dir = -1;
		if (code in this._movementKeys) { dir = this._movementKeys[code]; }

		if (dir != -1) {
			this._pendingDirection(dir);
			window.removeEventListener("keydown", this); 
			Game.engine.unlock();
		} else if (code != 27) {
			return;
		}
		this._buildStatus();
		this._pendingDirection = null;
		return;
	}

	if (code in this._movementKeys) { 
		this._tryMovement(this._movementKeys[code]);
		return; 
	}
	
	var used = false;
	switch (String.fromCharCode(code)) {
		case "S":
			if (this._powers.lightsaber) { used = this._lightsaber(); }
		break;

		case "Q":
			if (this._powers.push) { used = this._push(); }
		break;
		
		case "W":
			if (this._powers.pull) { used = this._pull(); }
		break;

		case "F":
			if (this._powers.fork) { used = this._fork(); }
		break;
	}
	
	if (used) {
		window.removeEventListener("keydown", this); 
		Game.engine.unlock();
	}
}

Game.Player.prototype.adjustHP = function(diff) {
	Game.SaberUser.prototype.adjustHP.call(this, diff);
	Game.display.updateStats();
	return this;
}

Game.Player.prototype.adjustMana = function(diff) {
	Game.SaberUser.prototype.adjustMana.call(this, diff);
	Game.display.updateStats();
	return this;
}

Game.Player.prototype._tryMovement = function(direction) {
	if (direction != -1) { /* regular movement direction */
		var dir = ROT.DIRS[8][direction];
		var x = this._position[0] + dir[0];
		var y = this._position[1] + dir[1];

		if (!this._isPassable(x, y)) { return; } /* occupied */
	}

	/* regen */
	if (this._hp < this._maxHP && ROT.RNG.getUniform() > Game.Rules.HP_REGEN) { this.adjustHP(1); }
	if (this._mana < this._maxMana && ROT.RNG.getUniform() > Game.Rules.MANA_REGEN) { this.adjustMana(1); }

	if (direction == -1) { /* noop */
		window.removeEventListener("keydown", this); 
		Game.engine.unlock();
		return;
	}
	
	/* move */
	Game.setBeing(x, y, this);

	window.removeEventListener("keydown", this);
	Game.engine.unlock();
}

Game.Player.prototype._buildStatus = function() {
	var data = [];

	if (this._powers.lightsaber) {
		data.push("Lightsaber=%c{#fff}s%c{}");
	}

	if (this._powers.push) {
		data.push("Force push=%c{#fff}q%c{}");
	}

	if (this._powers.pull) {
		data.push("Force pull=%c{#fff}w%c{}");
	}

	if (this._powers.fork) {
		data.push("Force fork=%c{#fff}f%c{}");
	}
	Game.display.setStatus(data.join("  "));

}

Game.Player.prototype._requestDirection = function(label, callback) {
	this._pendingDirection = callback;
	Game.display.setStatus(label + ": pick direction (ESC to cancel)");
}

Game.Player.prototype._push = function() {
	if (this._mana < Game.Rules.PUSH_PRICE) { 
		this._blinkMana();
		return false; 
	}
	this._requestDirection("Force push", this._pushInDirection.bind(this));
	return false; /* listen for direction */
}

Game.Player.prototype._pull = function() {
	if (this._mana < Game.Rules.PULL_PRICE) { 
		return false; 
		this._blinkMana();
	}
	this._requestDirection("Force pull", this._pullInDirection.bind(this));
	return false; /* listen for direction */
}

Game.Player.prototype._fork = function() {
	if (this._mana < Game.Rules.FORK_PRICE) { 
		this._blinkMana();
		return false; 
	}
	this._requestDirection("Force fork", this._forkInDirection.bind(this));
	return false; /* listen for direction */
}

Game.Player.prototype._pushInDirection = function(dir) {
	this.adjustMana(-Game.Rules.PUSH_PRICE);
	Game.engine.lock();
	new Game.Push(this, dir).go().then(function() {
		Game.engine.unlock();
	});
}

Game.Player.prototype._pullInDirection = function(dir) {
	this.adjustMana(-Game.Rules.PULL_PRICE);
	Game.engine.lock();
	new Game.Pull(this, dir).go().then(function() {
		Game.engine.unlock();
	});
}

Game.Player.prototype._forkInDirection = function(dir) {
	this.adjustMana(-Game.Rules.FORK_PRICE);
	Game.engine.lock();
	new Game.Fork(this, dir).go().then(function() {
		Game.engine.unlock();
	});
}
