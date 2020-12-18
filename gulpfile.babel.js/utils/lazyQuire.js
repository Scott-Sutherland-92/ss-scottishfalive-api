// LOAD FUNCTION - LAZY LOAD & CACHE
module.exports = function (require, path) {
	let worker = "";

	return function (a, b, c, d, e, f, g) {
		if (!worker) {
			worker = require(path);
		}

		return worker(a, b, c, d, e, f, g);
	};
};
