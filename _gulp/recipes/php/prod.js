const gulp = require("gulp");
const plumber = require("gulp-plumber");
const newer = require("gulp-newer");
const browserSync = require("browser-sync");

// CONFIG
const config = require("../../config/php");

module.exports = function (cb) {
	return gulp
		.src(config.paths.src)
		.pipe(plumber())
		.pipe(newer(config.paths.dest))
		.pipe(gulp.dest(config.paths.dest))
		.pipe(browserSync.reload({ stream: true }));
};