Game.Robot = function() {
	Game.Being.call(this);
	this._char = "R";
	this._color = "#999";
	this._remainsColor = this._color;
};
Game.Robot.extend(Game.Being);
