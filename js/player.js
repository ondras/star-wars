Game.Player = function(color, saberColor) {
	Game.Being.call(this);
	
	this._alive = true;
	this._name = "you";
	this._char = "@";
	this._color = color;
	this._saberColor = saberColor;

	this._maxHP = 13;
	this._hp = this._maxHP;

	this._maxMana = 13;
	this._mana = this._maxMana;
	
	this._moves = 0; /* successful moves - used to display a bubble */
	this._movementKeys = {};

	this._movementKeys[104]	= 0;
	this._movementKeys[105]	= 1;
	this._movementKeys[102]	= 2;
	this._movementKeys[99]	= 3;
	this._movementKeys[98]	= 4;
	this._movementKeys[97]	= 5;
	this._movementKeys[100]	= 6;
	this._movementKeys[103]	= 7;
	
	this._movementKeys[101]	= -1;
	this._movementKeys[110]	= -1;
	this._movementKeys[190]	= -1;
	
	this._movementKeys[37] = 6;
	this._movementKeys[38] = 0;
	this._movementKeys[39] = 2;
	this._movementKeys[40] = 4;
}
Game.Player.extend(Game.Being);

Game.Player.prototype.getHPFraction = function() {
	return this._hp/this._maxHP;
}

Game.Player.prototype.getManaFraction = function() {
	return this._mana/this._maxMana;
}

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
			used = this._lightsaber();
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

Game.Player.prototype.die = function() {
	Game.Being.prototype.die.call(this);
	this._alive = false;
}

Game.Player.prototype.adjustHP = function(diff) {
	Game.Being.prototype.adjustHP.call(this, diff);
	Game.display.updateStats();
	return this;
}

Game.Player.prototype.adjustMana = function(diff) {
	Game.Being.prototype.adjustMana.call(this, diff);
	Game.display.updateStats();
	return this;
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

	if (!this._isPassable(x, y)) { return; } /* occupied */

	this._moves++;
	if (this._hp < this._maxHP && ROT.RNG.getUniform() > Game.Rules.HP_REGEN) { this.adjustHP(1); }
	if (this._mana < this._maxMana && ROT.RNG.getUniform() > Game.Rules.MANA_REGEN) { this.adjustMana(1); }

	/* move */
	Game.setBeing(x, y, this);

	if (this._moves == 5) { /* show the bubble */ /* FIXME tune the number */
		Game.engine.lock();
		var bubble = new Game.Bubble("This is your %c{" + Game.COLOR_HEALTH + "}health%c{} & %c{" + Game.COLOR_MANA + "}force%c{} meter.");
		var height = Game.display.getOptions().height;
		bubble.anchorToColumn(0);
		bubble.show();
		bubble.then(function() { Game.engine.unlock(); });
	}

	window.removeEventListener("keydown", this);
	Game.engine.unlock();
}

Game.Player.prototype._lightsaber = function() {
	if (this._mana < Game.Rules.SABER_PRICE) { return false; }
	this.adjustMana(-Game.Rules.SABER_PRICE);
	new Game.Lightsaber(this, this._saberColor);
	return true;
}
