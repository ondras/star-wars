Game.Mickey = function() {
	Game.Being.call(this);
	this._char = "M";
	this._color = ["#faa", "#afa", "#aaf", "#ff8", "#f8f", "#8ff"].random();
};
Game.Mickey.extend(Game.Being);

Game.Mickey.prototype.act = function() {
	if (this._stunned) { 
		this._stunned = false; 
		return;
	}

	var pos = Game.player.getPosition();
	this._getToDistance(0, pos[0], pos[1]);
}
