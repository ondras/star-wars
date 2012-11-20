Game.SaberUser = function(type) {
	Game.Being.call(this);
	
	this._type = type;
	this._char			= (type == "jedi" ? "j" : "s");
	this._color			= (type == "jedi" ? "#fff" : "#888");
	this._saberColor	= (type == "jedi" ? "#33f" : "#f33");

	this._hp = Game.Rules.HP_SABERUSER;
	this._mana = Infinity;
}
Game.SaberUser.extend(Game.Being);

Game.SaberUser.prototype.getType = function() {
	return this._type;
}

Game.SaberUser.prototype.act = function() {
	if (this._stunned) { 
		this._stunned = false; 
		return;
	}

	var pos = Game.player.getPosition();
	if (this.distance(pos[0], pos[1]) == 1) {
		this._lightsaber();
	} else {
		this._getToDistance(1, pos[0], pos[1]);
	}
}

Game.SaberUser.prototype._lightsaber = function() {
	if (this._mana < Game.Rules.SABER_PRICE) { 
		this._blinkMana();
		return false; 
	}
	this.adjustMana(-Game.Rules.SABER_PRICE);

	Game.engine.lock();
	new Game.Lightsaber(this, this._saberColor).go().then(function() {
		Game.engine.unlock();
	});
	return true; /* no more listening */
}

Game.SaberUser.prototype._blinkMana = function() {
	Game.audio.play("no");
	var remain = 6;
	var step = function() {
		remain--;

		if (remain % 2) {
			var originalColor = Game.COLOR_MANA;
			Game.COLOR_MANA = "#fff";
			Game.display.updateStats();
			Game.COLOR_MANA = originalColor;
		} else {
			Game.display.updateStats();
		}

		if (remain) { setTimeout(step, 150); }
	}
	step();
}
