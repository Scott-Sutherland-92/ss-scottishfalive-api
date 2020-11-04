const gulp = require("gulp");

// CONFIG
const config = require("../../config/scripts");

/**
 * Watch style files
 * for changes
 *
 * @param done
 */
module.exports = function (done) {
	gulp.watch(config.paths.watch, gulp.parallel("scripts:dev"));
	done();
};
