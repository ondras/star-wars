var Promise = function() {
	this._ok = null;
	this._then = null;
}

Promise.prototype.then = function(ok) {
	this._ok = ok;
	this._then = new Promise();
	return this._then;
}

Promise.prototype.fulfill = function(value) {
	if (!this._ok) { return; }

	var result = this._ok(value);
	if (result instanceof Promise) {
		result.then(function(value) { 
			this._then.fulfill(value);
		}.bind(this));
	}
}


var Request = function(data) {
	var p = new Promise();
	var xhr = new XMLHttpRequest();
	xhr.open("get", "/?" + data, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState != 4) { return; }
		p.fulfill(xhr.responseText.substring(0, 20));
	}
	xhr.send(null);
	return p;
}

var p1 = Request("a");

/* p1 ocekava hodnotu. ale i kdyz ji dostane, nevi co delat
 * proto ji volanim "then" dame callback, ktery pak ma vykonat
 */

var p2 = p1.then(function(data) { return Request(data); })

/* co to kurvadrat je p2? */
/* potom, co do p1 posleme hodnotu, tak ona vykona svuj callback.
 * tenhle callback ale opet vraci promise. 
 * je nutno "sparovat" tuto nove vracenou promise s tou, kterou jsme vratili jako p2 !
 * to proto, aby se po splneni teto nove vracene promise rovnou hodnota preposlala do p2 */

p2.then(function(data) { return Request("xxxx" + data); });
