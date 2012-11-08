Game.Tutorial = function() {
	this._turnsTotal = 0;
	this._turnsLocal = 0;
	this._kills = 0;
	this._phase = this.constructor.PHASE_GAME;
}

Game.Tutorial.PHASE_INTRO		= 0;
Game.Tutorial.PHASE_MOVEMENT	= 1;
Game.Tutorial.PHASE_GAME		= 2;
Game.Tutorial.PHASE_OUTRO		= 3;
Game.Tutorial.PHASE_GAMEOVER	= 100;

Game.Tutorial.prototype.getSpeed = function() {
	return 100;
}

Game.Tutorial.prototype.getScore = function() {
	return this._kills;
}

Game.Tutorial.prototype.addKill = function(being) {
	if (being == Game.player) {
		this._phase = this.constructor.PHASE_GAMEOVER;
	} else {
		this._kills++;
		if (this._kills == Game.Rules.TARGET_KILLS) {
			this._phase = this.constructor.PHASE_OUTRO;
		} else if (this._phase != this.constructor.PHASE_GAME) {
			this._phase++; /* switch to next phase */
			this._turnsLocal = 0;
		}
	}
}

Game.Tutorial.prototype.act = function() {
	this._turnsTotal++;
	this._turnsLocal++;

	switch (this._phase) {
		case this.constructor.PHASE_INTRO:
			this._turnsLocal = 0;
			this._showIntroBubbles();
		break;

		case this.constructor.PHASE_MOVEMENT:
			if (this._turnsLocal >= 5) { this._showStatsBubble(); }
		break;

		case this.constructor.PHASE_GAME:
			if (ROT.RNG.getUniform() > Game.Rules.SPAWN_CHANCE) { this._spawn(); }
		break;

		case this.constructor.PHASE_OUTRO:
			this._showOutroBubble();
		break;

		case this.constructor.PHASE_GAMEOVER:
			this._showGameoverBubble();
		break;
	}
}

/**
 * Create a sequence of bubbles, with a common anchor
 */
Game.Tutorial.prototype._showBubbles = function(texts, anchorCallbacks, doneCallback) {
	var bubble = new Game.Bubble(texts.shift());
	anchorCallbacks.shift()(bubble);
	var first = bubble;

	while (texts.length) {
		var text = texts.shift();
		var ac = anchorCallbacks.shift();
		bubble = bubble.then(function(text, ac) { 
			var newBubble = new Game.Bubble(text);
			ac(newBubble);
			newBubble.show();
			return newBubble;
		}.bind(this, text, ac));
	}

	bubble.then(doneCallback);
	first.show();
}

Game.Tutorial.prototype._showIntroBubbles = function() {
	Game.engine.lock();
	var name = Game.player.getType();
	name = name.charAt(0).toUpperCase() + name.substring(1);

	var texts = [
		"This is you, a mighty " + name + ". Move around using arrow keys or numpad.",
		"This is your %c{" + Game.COLOR_HEALTH + "}health%c{} & %c{" + Game.COLOR_MANA + "}force%c{} meter. Both health and force slowly regenerate.",
		"This is your score bar. " + Game.Rules.TARGET_KILLS + " kills are necessary to finish your training.",
		"Move around by using arrow keys or numpad. Try it now!",
	];

	var lastCol = Game.display.getOptions().width-1;

	var anchorCallbacks = [
		function(bubble) { bubble.anchorToBeing(Game.player); },
		function(bubble) { bubble.anchorToColumn(0); },
		function(bubble) { bubble.anchorToColumn(lastCol); },
		function(bubble) { bubble.anchorToBeing(Game.player); }
	]

	var doneCallback = function() {
		this._phase++;
		this._turnsLocal = 0;
		Game.engine.unlock();
	}

	this._showBubbles(texts, anchorCallbacks, doneCallback.bind(this));
}

Game.Tutorial.prototype._showStatsBubble = function() {
	Game.engine.lock();

	var cb = function() {
		this._phase++;
		Game.engine.unlock();
	}

	var bubble = new Game.Bubble("This is your %c{" + Game.COLOR_HEALTH + "}health%c{} & %c{" + Game.COLOR_MANA + "}force%c{} meter.");
	bubble.anchorToColumn(0).show();
	bubble.then(cb.bind(this));
}

Game.Tutorial.prototype._showOutroBubble = function() {
	Game.engine.lock();

	var bubble = new Game.Bubble("Congratulations! You have finished your training and mastered the way of the Force!\n\nElapsed turns: %c{#fff}" + (this._turnsTotal-1), true);
	bubble.anchorToBeing(Game.player).show();
}

Game.Tutorial.prototype._showGameoverBubble = function() {
	Game.engine.lock();

	var bubble = new Game.Bubble("You are dead.\n\nGame over!", true);
	bubble.anchorToBeing(Game.player).show();
}

/**
 * Spawn a random enemy
 */
Game.Tutorial.prototype._spawn = function() {
	var def = {};
	def["Mickey"] = 4;
	def["Robot"] = 3;
	def["Clone"] = 2;

	var name = this._pickRandom(def);
	var being = new Game[name]();
	Game.spawnBeing(being);
}

Game.Tutorial.prototype._pickRandom = function(data) {
	var avail = [];
	var total = 0;
	
	for (var id in data) {
		total += data[id];
	}
	var random = Math.floor(ROT.RNG.getUniform()*total);
	
	var part = 0;
	for (var id in data) {
		part += data[id];
		if (random < part) { return id; }
	}
}
