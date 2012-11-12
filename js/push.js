/**
 * Force push
 */
Game.Push = function(being, direction) {
	this._force = new Game.Force.call(this, being, direction, 8);
	this._force.setBeingMethod("push", Game.Rules.PUSH_FORCE_MIN, Game.Rules.PUSH_FORCE_MAX));
	this._force.setWaveOrder(1);
}

Game.Push.prototype.go = function() {
	return this._force.go();
}