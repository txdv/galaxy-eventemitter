/*
	This is a eventemitter wrapper for galaxy.
	If you have an [EventEmitter](nodejs.org/api/events.html) you can use this functionality
	to call once in with the yield keyword.
*/
(function() {
	var EventEmitter = require('events').EventEmitter;
	var galaxy = require('galaxy');

	// a star function wrapper for once
	// makes it really awesome to use for waiting withing a certain context
	EventEmitter.prototype.onceAsync = galaxy.star(function (name, timeout, callback) {
		if (!callback) {
			callback = timeout;
			// this is a sentinel timeout, it keeps the object loop alife
			// couldn't find a more appropriate method than
			// taking a big number
			timeout = setTimeout(function() { }, 100000000);
			this.once(name, function (error, value) {
				if (typeof callback === 'function') {
					callback(error, value);
				}
				clearTimeout(timeout);
			});
		} else {
			var finished = false;

			var timeout = setTimeout(function() {
				callback('timeout');
				finished = true;
			}, timeout);

			this.once(name, function (error, value) {
				if (!finished) {
					clearTimeout(timeout);
					callback(error, value);
				}
			});
		}
	});

	if (module.parent) {
		return;
	}

/*
	// old ugly callback style based code
	var ev = new EventEmitter();
	ev.once('event', function () {
		console.log('event!');
	});

	setTimeout(function() {
		ev.emit('event');
	}, 100);
*/

	galaxy.main(function *() {
		var ev = new EventEmitter();

		setTimeout(function() {
			ev.emit('event');
		}, 1000);

		// now we can ust wait!
		console.log('pre');
		yield ev.onceAsync('event');
		console.log('post');
		// no callback for once
	});
})();
