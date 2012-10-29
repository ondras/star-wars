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
		
		this.setBeing(1, 0, new Game.Clone());
		this.setBeing(-3, 0, new Game.Robot());

		
		new Game.Bubble(0, 0, "This is you. Move around using arrow keys or numpad.")
//			.then(function() { new Game.Bubble(-30, 0, "This is your health & force meter."); })
			.then(function() { this.engine.start(); }.bind(this));
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
