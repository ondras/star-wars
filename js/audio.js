Game.Audio = function() {
	this._supported = !!window.Audio;
	var tmp = new Audio();
	this._ext = (tmp.canPlayType("audio/ogg") ? "ogg" : "mp3");
	
	this._effects = {
		death:		{ count: 5 },
		mickey:		{ count: 2 },
		fork:		{ count: 1 },
		push:		{ count: 1 },
		pull:		{ count: 1 },
		robot:		{ count: 1 },
		deflect:	{ count: 3 },
		blaster:	{ count: 4 },
		saber:		{ count: 8 },
		saberon:	{ count: 1 },
		victory:	{ count: 1 },
		no:			{ count: 1 }
	};

	for (var name in this._effects) {
		var data = this._effects[name];
		data.audio = [];
		for (var i=0;i<data.count;i++) {
			var n = name;
			if (data.count > 1) { n += i; }
			var a = new Audio(this._expandName(n));
			a.volume = 0.6;
			a.load();
			data.audio.push(a);
		}
	}
}
	
Game.Audio.prototype.play = function(name) {
	if (!this._supported) { return; }
	var data = this._effects[name];
	if (!data) { return; }
	data.audio.random().play();
}

Game.Audio.prototype._expandName = function(name) {
	return "sfx/" + name  + "." + this._ext;
}
