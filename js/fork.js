/**
 * Force fork (lightning)
 */
Game.Fork = function(being, direction) {
	Game.audio.play("fork");
	this._force = new Game.Force(being, direction, 6);
	this._force.setBeingMethod("damage", Game.Rules.FORK_DAMAGE, Game.Rules.FORK_DAMAGE);
	this._force.offsetChars(2);
	this._force.setWaveOrder(1);
	this._force.clearEachRow(false);
	this._force.setDelay(75);
}

Game.Fork.prototype.go = function() {
	return this._force.go();
}