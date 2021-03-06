const log = require("fancy-log");
const supportsColor = require("supports-color");

let callingDone = false;
const defaultStatsOptions = {
	colors: supportsColor,
	hash: false,
	timings: false,
	chunks: false,
	chunkModules: false,
	modules: false,
	children: true,
	version: true,
	cached: false,
	cachedAssets: false,
	reasons: false,
	source: false,
	errorDetails: false,
};

// OUTPUT CONSOLE STATS
module.exports = function (err, stats, options) {
	stats = stats || {};
	options = options || {};

	if (options.quiet || callingDone) {
		return;
	}

	// Debounce output a little for when in watch mode
	if (options.watch) {
		callingDone = true;
		setTimeout(function () {
			callingDone = false;
		}, 500);
	}

	if (options.verbose) {
		log(
			stats.toString({
				colors: supportsColor,
			})
		);
	} else {
		var statsOptions = (options && options.stats) || {};

		Object.keys(defaultStatsOptions).forEach(function (key) {
			if (typeof statsOptions[key] === "undefined") {
				statsOptions[key] = defaultStatsOptions[key];
			}
		});

		log(stats.toString(statsOptions));
	}
};
