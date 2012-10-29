var Promise = function() {
	this._callbacks = {
		ok: null
	}
	this._thenPromise = null;
}

Promise.prototype.then = function(ok) {
	this._callbacks.ok = ok;
	this._thenPromise = new Promise();
	return this._thenPromise;
}

Promise.prototype.fulfill = function(value) {
	if (!this._callbacks.ok) { return; }

	var result = this._callbacks.ok(value);
	if (result instanceof Promise) {
		result.then(function(value) { 
			this._thenPromise.fulfill(value);
		}.bind(this));
	} else {
		this._thenPromise.fulfill(result);
	}
}

/*
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
var p2 = p1.then(function(data) { return Request(data); })
p2.then(function(data) { return Request("xxxx" + data); });
*/