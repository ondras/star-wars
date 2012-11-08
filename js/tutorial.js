Game.Tutorial = function() {
	this._turnsTotal = 0;
	this._turnsLocal = 0;
	this._kills = 0;
	this._phase = this.constructor.PHASE_GAME*0;
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
		if (this._kills == 26) { /* FIXME constant */
			this._phase = this.constructor.PHASE_OUTRO;
		} else {
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
			this._showIntroBubbles();
		break;

		case this.constructor.PHASE_MOVEMENT:
			if (this._turnsLocal >= 5) { this._showStatsBubble(); }
		break;

		case this.constructor.PHASE_GAME:
			if (ROT.RNG.getUniform() > 0.8) { this._spawn(); } /* FIXME constant */
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

	var texts = [
		"This is you. Move around using arrow keys or numpad.",
		"This is your %c{" + Game.COLOR_HEALTH + "}health%c{} & %c{" + Game.COLOR_MANA + "}force%c{} meter."
	];

	var anchorCallbacks = [
		function(bubble) { bubble.anchorToBeing(Game.player); },
		function(bubble) { bubble.anchorToColumn(0); },
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
	bubble.anchorToColumn(0);
	bubble.show();
	bubble.then(cb.bind(this));
}

Game.Tutorial.prototype._showOutroBubble = function() {
	Game.engine.lock();

	var bubble = new Game.Bubble("Congratulations! You have finished your training and mastered the way of the Force!", true);
	bubble.anchorToBeing(Game.player);
	bubble.show();
}

Game.Tutorial.prototype._showGameoverBubble = function() {
	Game.engine.lock();

	var bubble = new Game.Bubble("You are dead.\n\nGame over!", true);
	bubble.anchorToBeing(Game.player);
	bubble.show();
}

/**
 * Spawn a random enemy
 */
Game.Tutorial.prototype._spawn = function() {

}