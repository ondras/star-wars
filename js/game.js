var Game = {
	beings: {},

	init: function() {
		this.terrain = new Game.Terrain();
		this.player = new Game.Player();

		this.engine = new ROT.Engine();
		this.engine.addActor(this.player);

		this.display = new Game.Display();
		document.body.appendChild(this.display.getContainer());

		this.setBeing(0, 0, this.player);
		
		var clone = new Game.Clone();
		this.setBeing(1, 0, clone);

		this.engine.start();
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
