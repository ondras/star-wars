Game.Clone = function() {
	Game.Being.call(this);
	this._char = "C";
};
Game.Clone.extend(Game.Being);

Game.Clone.FIRE_DISTANCE = 5;
Game.Clone.FIRE_CHANCE = 0.3;

/**
 * Get to a fixed distance, fire
 */
Game.Clone.prototype.act = function() {
	var pos = Game.player.getPosition();
	var dist = this._distance(pos[0], pos[1]);
	if (dist != this.constructor.FIRE_DISTANCE) { 
		this._getToDistance(this.constructor.FIRE_DISTANCE, pos[0], pos[1]);
		return;
	}
	
	if (ROT.RNG.getUniform() > this.constructor.FIRE_CHANCE) {
		new Game.Blaster(this, pos[0], pos[1]);
	} else {
		this._wander();
	}
}
