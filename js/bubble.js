Game.Bubble = function(text, final) {
	this._text = text + (final ? "" : "\n\n%c{saddlebrown}(Enter to continue)");
	this._final = final;
	this._cells = {};
	this._promise = new Promise();
	this._geom = {
		border: 2,
		dist: 1,
		left: 0,
		top: 0,
		width: 0,
		height: 0,
		textWidth: 0
	};

	if (!final) { window.addEventListener("keydown", this); }
}

Game.Bubble.prototype.handleEvent  = function(e) {
	if (e.keyCode != 13) { return }
	window.removeEventListener("keydown", this);
	Game.display.showBubble(null);
	Game.display.setCenter();

	this._promise.fulfill();
}

Game.Bubble.prototype.getCells = function() {
	return this._cells;
}

Game.Bubble.prototype.anchorToBeing = function(being) {
	var pos = being.getPosition();
	var x = pos[0];
	var y = pos[1];
	this._compute(x, y);
	return this;
}

Game.Bubble.prototype.anchorToColumn = function(x) {
	var offset = Game.display.getOffset();
	var height = Game.display.getOptions().height-1;
	var y = Math.round(height / 2);

	this._compute(x + offset[0], y + offset[1]);

	for (var i=0;i<height;i++) {
		this._cells[x+","+i] = true;
	}

	return this;
}

Game.Bubble.prototype.show = function() {
	for (var i=0; i<this._geom.width; i++) {
		for (var j=0; j<this._geom.height; j++) {
			var dx = i+this._geom.left;
			var dy = j+this._geom.top;
			this._cells[dx+","+dy] = true;

			var ch = "";
			if (i == 0 || i+1 == this._geom.width) { ch = "|"; }
			if (j == 0 || j+1 == this._geom.height) { 
				ch = (ch == "|" ? "+" : "-");
			}

			Game.display.draw(dx, dy, ch, "saddlebrown");
		}
	}
	Game.display.drawText(this._geom.left+this._geom.border, this._geom.top+this._geom.border, this._text, this._geom.textWidth);
	Game.display.showBubble(this);

	return this._promise;
}

Game.Bubble.prototype._compute = function(x, y) {
	var offset = Game.display.getOffset();
	x -= offset[0];
	y -= offset[1];
	this._cells[x + "," + y] = true;

	var avail = Game.display.getOptions();
	var textSize = Game.display.measureText(this._text, Math.ceil(avail.width/2));

	this._geom.textWidth = textSize.width;
	this._geom.width = textSize.width + 2*this._geom.border;
	this._geom.height = textSize.height + 2*this._geom.border - (this._final ? 0 : 1);

	if (x < avail.width/3) { /* left */
		this._geom.left = x + this._geom.dist + 1;
	} else if (x > 2*avail.width/3) { /* right */
		this._geom.left = x - this._geom.dist - this._geom.width;
	} else { /* middle */
		this._geom.left = Math.round(x - this._geom.border - textSize.width/2);
	}

	if (y < avail.height/3) { /* top */
		this._geom.top = y + this._geom.dist + 1;
	} else if (y > 2*avail.height/3 || (x >= avail.width/3 && x <= 2*avail.width/3)) { /* middle, bottom */
		this._geom.top = y - this._geom.dist - this._geom.height;
	} else { /* middle */
		this._geom.top = Math.round(y - this._geom.border - textSize.height/2);
	}

}
