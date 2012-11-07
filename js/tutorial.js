Game.Tutorial = function() {
	this._turns = 0;
	this._kills = 0;
	this._phase = this.constructor.PHASE_INTRO + 1000;
}
Game.Tutorial.PHASE_INTRO		= 0;
Game.Tutorial.PHASE_MOVEMENT	= 1;
Game.Tutorial.PHASE_GAME		= 2;
Game.Tutorial.PHASE_OUTRO		= 3;
Game.Tutorial.PHASE_GAMEOVER	= 100;

Game.Tutorial.prototype.getSpeed = function() {
	return 100;
}

Game.Tutorial.prototype.addKill = function(being) {
	if (being == Game.player) {
		this._phase = this.constructor.PHASE_GAMEOVER;
	} else {
		this._kills++;
		if (this._kills == 26) { this._phase = this.constructor.PHASE_OUTRO; } /* FIXME constant */
	}
}

Game.Tutorial.prototype.act = function() {
	this._turns++;

	switch (this._phase) {
		case this.constructor.PHASE_INTRO:
			this._showIntroBubble();
		break;

		case this.constructor.PHASE_MOVEMENT:
			if (this._turns >= 5) { this._showStatsBubble(); }
		break;

		case this.constructor.PHASE_GAME:
		break;

		case this.constructor.PHASE_OUTRO:
			this._showOutroBubble();
		break;

		case this.constructor.PHASE_GAMEOVER:
			this._showGameoverBubble();
		break;
	}
}

Game.Tutorial.prototype._showIntroBubble = function() {
	Game.engine.lock();

	var cb = function() {
		this._phase++;
		this._turns = 0;
		Game.engine.unlock();
	}

	var bubble = new Game.Bubble("This is you. Move around using arrow keys or numpad.");
	bubble.anchorToBeing(Game.player);
	bubble.show();
	bubble.then(cb.bind(this));
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
