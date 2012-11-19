Game.Robot = function() {
	Game.Being.call(this);
	this._char = "D";
	this._color = "#bb9";
	this._hp = Game.Rules.HP_ROBOT;
	this._deathSound = "robot";
	this._remainsColor = this._color;
};
Game.Robot.extend(Game.Being);

Game.Robot.FIRE_CHANCE = 0.3;

/**
 * Get within a fixed distance, fire
 */
Game.Robot.prototype.act = function() {
	if (this._stunned) { 
		this._stunned = false; 
		return;
	}

	var pos = Game.player.getPosition();
	var dist = this.distance(pos[0], pos[1]);
	if (dist > Game.Rules.BLASTER_RANGE) { 
		this._getToDistance(0, pos[0], pos[1]);
		return;
	}
	
	if (ROT.RNG.getUniform() > this.constructor.FIRE_CHANCE) {
		new Game.Blaster(this, pos[0], pos[1]);
	} else {
		this._wander();
	}
}
