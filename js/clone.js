Game.Clone = function() {
	Game.Being.call(this);
	this._char = "C";
};
Game.Clone.extend(Game.Being);
