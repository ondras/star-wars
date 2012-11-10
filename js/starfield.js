Game.Starfield = {
	_canvas: document.createElement("canvas"),

	start: function() {
		var size = 256;
		this._canvas.width = size;
		this._canvas.height = size;
		var ctx = this._canvas.getContext("2d");

		var colors = ["#ddd", "#aaa", "#777"];

		for (var i=0;i<100;i++) {
			var x = ~~(size * ROT.RNG.getUniform());
			var y = ~~(size * ROT.RNG.getUniform());

			var index = Math.floor(ROT.RNG.getUniform() * colors.length);
			ctx.fillStyle = colors.random();
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.arc(x, y, 0.5 + ROT.RNG.getUniform()*1, 0, 2*Math.PI, 0);
			ctx.fill();
		}


		var url = this._canvas.toDataURL("image/png");
		document.body.style.backgroundImage = "url(" + url + ")";
	},

	stop: function() {
		document.body.style.backgroundImage = "";
	}
}
