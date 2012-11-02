Game.Mickey = function() {
	Game.Being.call(this);
	this._char = "M";
	this._color = ["#faa", "#afa", "#aaf", "#ff8", "#f8f", "#8ff"].random();
};
Game.Mickey.extend(Game.Being);

Game.Mickey.prototype.act = function() {
	var pos = Game.player.getPosition();
	this._approach(pos[0], pos[1]);
}
