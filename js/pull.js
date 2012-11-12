/**
 * Force pull
 */
Game.Pull = function(being, direction) {
	this._force = new Game.Force(this, being, direction, 8);
	this._force.setBeingMethod("push", Game.Rules.PULL_FORCE_MIN, Game.Rules.PULL_FORCE_MAX);
	this._force.setWaveOrder(-1);
}
Game.Pull.prototype.go = function() {
	return this._force.go();
}
