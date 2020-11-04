const gulp = require("gulp");

// CONFIG
const config = require("../../config/assets");

/**
 * Watch style files
 * for changes
 *
 * @param done
 */
module.exports = function (done) {
	gulp.watch(config.paths.watch, gulp.parallel("assets:dev"));
	done();
};
