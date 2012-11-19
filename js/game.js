var Game = {
	COLOR_HEALTH: "#f33",
	COLOR_MANA: "#33f",
	COLOR_SCORE: "#ff3",
	beings: {},
	terrain: null,
	player: null,
	engine: null,
	tutorial: null,
	display: null,
	audio: null,

	intro: function() {
		if (!ROT.isSupported()) { return alert("Sorry, your browser is not sexy enough to run this game :-("); }

		document.addEventListener("click", this);
		this.audio = new Game.Audio();
		Game.Starfield.start();
	},

	handleEvent: function(e) {
		switch (e.type) {
			case "click":
				var t = e.target;
				while (t) {
					if (t.className == "jedi" || t.className == "sith") { 
						this._init(t.className); 
						break;
					}
					t = t.parentNode;
				}
			break;

			case "keydown": /* to prevent quick search */
				var mods = ["alt", "ctrl", "meta", "shift"];
				var prevent = true;
				for (var i=0;i<mods.length;i++) {
					var name = mods[i] + "Key";
					if (e[name]) { prevent = false; }
				}
				if (prevent) { e.preventDefault(); }
			break;
		}
	},

	getBeingsInDistance: function(x, y, dist) {
		var result = [];
		for (var key in this.beings) {
			var b = this.beings[key];
			var d = b.distance(x, y);
			if (d > 0 && d <= dist) { result.push(b); }
		}
		return result;
	},

	generateCellArc: function(x, y, direction, length) {
		var result = [];

		var previousDirections = [ /* directions to previous cells */
			(direction+3).mod(8),
			(direction+4).mod(8),
			(direction+5).mod(8),
		];

		/* directions converted to delta arrays */
		var dir = ROT.DIRS[8][direction];
		var previousDirs = [];
		for (var i=0;i<previousDirections.length;i++) {
			previousDirs.push(ROT.DIRS[8][previousDirections[i]]);
		}

		var rowLength;
		var startDiff = ROT.DIRS[8][(direction - 1).mod(8)];
		var diff = ROT.DIRS[8][(direction + 2).mod(8)];
		var start = [0, 0];

		/* main computation */
		for (var i=0;i<length;i++) {
			var cellRow = [];

			if (direction % 2) {
				rowLength = i+2;
				start[0] = x + (i+1)*startDiff[0];
				start[1] = y + (i+1)*startDiff[1];
			} else {
				rowLength = 2*i+1;
				start[0] = x + dir[0] + i*startDiff[0];
				start[1] = y + dir[1] + i*startDiff[1];
			}

			for (var j=0;j<rowLength;j++) { /* for every cell in row */
				cellRow.push([start[0]+j*diff[0], start[1]+j*diff[1]]);
			}

			result.push(cellRow);
		} /* for all rows */

		return result;
	},

	directionToChar: function(dx, dy, chars) {
		var angle = Math.atan2(dy, dx);
		angle = (angle - Math.PI/8).mod(Math.PI) * 4 / Math.PI;
		return chars[Math.floor(angle) % 4];
	},

	_init: function(color, saber) {
		Game.audio.play("saberon");
		Game.Starfield.stop();
		window.addEventListener("keydown", this);
		document.removeEventListener("click", this);
		document.body.innerHTML = "";

		this.terrain = new Game.Terrain();
		this.player = new Game.Player(color, saber);

		this.engine = new ROT.Engine();
		this.tutorial = new Game.Tutorial();
		this.engine.addActor(this.tutorial);

		this.display = new Game.Display();
		document.body.appendChild(this.display.getContainer());

		this.spawnBeing(this.player, 0, 0);
//		this.spawnBeing(new Game.Mickey(), 2, 0);

		setTimeout(function() { document.body.className = ""; }, 1); /* hack to start transition */

		Game.engine.start();
	},

	setBeing: function(x, y, being) {
		var oldPosition = being.getPosition();
		if (oldPosition) {
			var oldKey = oldPosition.join(",");
			if (this.beings[oldKey] == being) { delete this.beings[oldKey]; }
			this.display.update(oldPosition[0], oldPosition[1]);
		}

		var key = x+","+y;
		being.setPosition(x, y);

		if (x !== null) {
			this.beings[key] = being;
			this.display.update(x, y);
		}

		if (being == this.player) { this.display.setCenter(); }
	},
	
	removeBeing: function(being) {
		this.tutorial.addKill(being);
		this.engine.removeActor(being); 
		var oldPosition = being.getPosition();
		if (!oldPosition) { return; }
		var oldKey = oldPosition.join(",");
		if (this.beings[oldKey] == being) { delete this.beings[oldKey]; }
		this.display.update(oldPosition[0], oldPosition[1]);
		this.display.updateScore();
	},

	spawnBeing: function(being, x, y) { /* spawn being, optionally at a border */
		if (arguments.length == 1) {
			var pos = this._findFreeBorder();
			if (!pos) { return false; }
			x = pos[0];
			y = pos[1];
		}

		this.engine.addActor(being);
		this.setBeing(x, y, being);

		return true;
	},

	_findFreeBorder: function() {
		var list = [];
		var opts = Game.display.getOptions();
		var w = opts.width;
		var h = opts.height;
		var offset = Game.display.getOffset();

		for (var i=1;i<w-1;i++) { /* rows */
			list.push([i+offset[0], 0+offset[1]]);
			list.push([i+offset[0], h-2+offset[1]]);
		}

		for (var j=0;j<h-1;j++) { /* cols */
			list.push([1+offset[0], j+offset[1]]);
			list.push([w-2+offset[0], j+offset[1]]);
		}

		var avail = [];
		for (var i=0;i<list.length;i++) {
			if (Game.terrain.get(list[i][0], list[i][1]) == Game.Terrain.TYPE_LAND) { avail.push(list[i]); }
		}
		return avail.random();
	}
}
