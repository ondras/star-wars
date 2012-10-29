var Game = {
	COLOR_HEALTH: "#f33",
	COLOR_MANA: "#33f",
	beings: {},

	intro: function() {
		if (!ROT.isSupported()) { return alert("Sorry, your browser is not sexy enough to run this game :-("); }

		document.addEventListener("click", this);
		Game.Starfield.start();
	},

	handleEvent: function(e) {
		var t = e.target;
		while (t) {
			if (t.className == "jedi") {
				this._init("#fff", "#33f");
			} else if (t.className == "sith") {
				this._init("#888", "#f33");
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
		this.engine.addActor(this.player);

		this.display = new Game.Display();
		document.body.appendChild(this.display.getContainer());

		this.setBeing(0, 0, this.player);
		
		this.setBeing(1, 0, new Game.Clone());
		this.setBeing(-3, 0, new Game.Robot());

		var bubble = new Game.Bubble("This is you. Move around using arrow keys or numpad.");
		bubble.anchorToBeing(this.player);
		bubble.show();
		bubble.then(function() { Game.engine.start(); })
//		.then(function() { return new Game.Bubble("This is your %c{" + Game.COLOR_HEALTH + "}health%c{} & %c{" + Game.COLOR_MANA + "}force%c{} meter.").anchorToDisplay(0, 0).show(); })
		setTimeout(function() { document.body.className = ""; }, 1); /* hack to start transition */
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
		var oldPosition = being.getPosition();
		if (!oldPosition) { return; }
		var oldKey = oldPosition.join(",");
		if (this.beings[oldKey] == being) { delete this.beings[oldKey]; }
		this.display.draw(oldPosition[0], oldPosition[1]);
	}
}
