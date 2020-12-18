// CONSTANTS
const gulp = require("gulp");
const del = require("del");
const plumber = require("gulp-plumber");
const newer = require("gulp-newer");
const browserSync = require("browser-sync");

// CONFIG
const config = require("../../config/libraries");

// LIBRARIES CLEAN
const _librariesClean = (cb) => {
	cb();
};

// LIBRARIES DEVELOPMENT BUILD
const _librariesBuild = (cb) => {
	return gulp
		.src(config.paths.src)
		.pipe(plumber())
		.pipe(newer(config.paths.dest))
		.pipe(gulp.dest(config.paths.dest))
		.pipe(browserSync.reload({ stream: true }));
};

// LIBRARIES PRODUCTION BUILD
const _librariesProd = (cb) => {
	return gulp
		.src(config.paths.src)
		.pipe(plumber())
		.pipe(newer(config.paths.dest))
		.pipe(gulp.dest(config.paths.dest))
		.pipe(browserSync.reload({ stream: true }));
};

// LIBRARIES WATCH
const _librariesWatch = (done) => {
	gulp.watch(config.paths.watch, _librariesBuild);
	done();
};

// OUTPUT OBJECT
module.exports.librariesClean = _librariesClean;
module.exports.librariesBuild = _librariesBuild;
module.exports.librariesWatch = _librariesWatch;
