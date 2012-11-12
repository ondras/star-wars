/**
 * Force fork (lightning)
 */
Game.Fork = function(being, direction) {
	this._force = new Game.Force(being, direction, 6);
	this._force.setBeingMethod("damage", Game.Rules.FORK_DAMAGE, Game.Rules.FORK_DAMAGE);
	this._force.offsetChars(2);
	this._force.setWaveOrder(1);
	this._force.clearEachRow(false);
}

Game.Fork.prototype.go = function() {
	return this._force.go();
}