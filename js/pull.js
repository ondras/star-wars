/**
 * Force pull
 */
Game.Pull = function(being, direction) {
	Game.audio.play("pull");
	this._force = new Game.Force(being, direction, 8);
	this._force.setBeingMethod("pull", Game.Rules.PULL_FORCE_MIN, Game.Rules.PULL_FORCE_MAX);
	this._force.setWaveOrder(-1);
	this._force.clearEachRow(true);
}
Game.Pull.prototype.go = function() {
	return this._force.go();
}
