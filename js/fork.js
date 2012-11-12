/**
 * Force fork (lightning)
 */
Game.Fork = function(being, direction) {
	this._force = new Game.Force.call(this, being, direction, 6);
	this._force.setBeingMethod("push", 0, 0));
	this._force.offsetChars(2);
	this._force.setWaveOrder(1);
}

Game.Fork.prototype.go = function() {
	return this._force.go();
}