Game.Robot = function() {
	Game.Being.call(this);
	this._char = "R";
	this._color = "#999";
	this._remainsColor = this._color;
};
Game.Robot.extend(Game.Being);

Game.Robot.FIRE_DISTANCE = 5;
Game.Robot.FIRE_CHANCE = 0.3;

/**
 * Get within a fixed distance, fire
 */
Game.Robot.prototype.act = function() {
	var pos = Game.player.getPosition();
	var dist = this._distance(pos[0], pos[1]);
	if (dist > this.constructor.FIRE_DISTANCE) { 
		this._getToDistance(0, pos[0], pos[1]);
		return;
	}
	
	if (ROT.RNG.getUniform() > this.constructor.FIRE_CHANCE) {
		new Game.Blaster(this, pos[0], pos[1]);
	} else {
		this._wander();
	}
}
