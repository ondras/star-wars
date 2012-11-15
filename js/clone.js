Game.Clone = function() {
	Game.Being.call(this);
	this._char = "C";
	this._hp = Game.Rules.HP_CLONE;
};
Game.Clone.extend(Game.Being);

Game.Clone.FIRE_CHANCE = 0.3;

/**
 * Get to a fixed distance, fire
 */
Game.Clone.prototype.act = function() {
	if (this._stunned) { 
		this._stunned = false; 
		return;
	}

	var pos = Game.player.getPosition();
	var dist = this.distance(pos[0], pos[1]);
	if (dist != Game.Rules.BLASTER_RANGE) { 
		this._getToDistance(Game.Rules.BLASTER_RANGE, pos[0], pos[1]);
		return;
	}
	
	if (ROT.RNG.getUniform() > this.constructor.FIRE_CHANCE) {
		new Game.Blaster(this, pos[0], pos[1]);
	} else {
		this._wander();
	}
}
