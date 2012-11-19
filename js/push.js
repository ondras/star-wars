/**
 * Force push
 */
Game.Push = function(being, direction) {
	Game.audio.play("push");
	this._force = new Game.Force(being, direction, 8);
	this._force.setBeingMethod("push", Game.Rules.PUSH_FORCE_MIN, Game.Rules.PUSH_FORCE_MAX);
	this._force.setWaveOrder(1);
	this._force.clearEachRow(true);
}

Game.Push.prototype.go = function() {
	return this._force.go();
}