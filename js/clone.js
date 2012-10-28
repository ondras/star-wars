Game.Clone = function() {
	Game.Being.call(this);
	this._char = "c";
};
Game.Clone.extend(Game.Being);
