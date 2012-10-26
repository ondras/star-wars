Game.Being = function() {
	this._position = null;
	this._name = "";
	this._speed = 100;
}

Game.Being.prototype.getColor = function() {

}

Game.Being.prototype.getChar = function() {
	
}

Game.Being.prototype.getSpeed = function() {
	return this._speed;
}

Game.Being.prototype.getName = function() {
	return this._name;
}

Game.Being.prototype.setPosition = function(x, y) {
	this._position = (x === null ? null : [x, y]);
	return this;
}

Game.Being.prototype.getPosition = function() {
	return this._position;
	
}

Game.Being.prototype.act = function() {

}

Game.Being.prototype.die = function() {
	Game.removeBeing(this);
}
