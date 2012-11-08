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

	intro: function() {
		if (!ROT.isSupported()) { return alert("Sorry, your browser is not sexy enough to run this game :-("); }

		document.addEventListener("click", this);
		Game.Starfield.start();
	},

	handleEvent: function(e) {
		var t = e.target;
		while (t) {
			if (t.className == "jedi" || t.className == "sith") { 
				this._init(t.className); 
				break
			}
			t = t.parentNode;
		}
	},

	_init: function(color, saber) {
		Game.Starfield.stop();
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
		this.spawnBeing(new Game.Clone(), 1, 0);
		this.spawnBeing(new Game.Robot(), -3, 0);
		this.spawnBeing(new Game.Mickey());

		setTimeout(function() { document.body.className = ""; }, 1); /* hack to start transition */

		this.player.adjustPowers({lightsaber:true});
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
		this.display.draw(oldPosition[0], oldPosition[1]);
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
