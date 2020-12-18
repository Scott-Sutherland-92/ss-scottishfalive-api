// CONSTANTS

require("dotenv").config();
const dev = process.env.DEV_MODE == "true" ? true : false;

const del = require("del");
const gulp = require("gulp");
const plumber = require("gulp-plumber");
const newer = require("gulp-newer");
const browserSync = require("browser-sync");

// CONFIG
const config = require("../../config/php");

// PHP CLEAN
const _phpClean = (done) => {
	del(config.paths.clean, { force: true }).then(function () {
		done();
	});
};

// PHP DEVELOPMENT BUILD
const _phpDev = (cb) => {
	return gulp
		.src(config.paths.src)
		.pipe(plumber())
		.pipe(newer(config.paths.dest))
		.pipe(gulp.dest(config.paths.dest))
		.pipe(browserSync.reload({ stream: true }));
};

// PHP PRODUCTION BUILD
const _phpProd = (cb) => {
	return gulp
		.src(config.paths.src)
		.pipe(plumber())
		.pipe(newer(config.paths.dest))
		.pipe(gulp.dest(config.paths.dest))
		.pipe(browserSync.reload({ stream: true }));
};

// PHP WATCH
const _phpWatch = (done) => {
	let buildProcess = dev ? _phpDev : _phpProd;
	gulp.watch(config.paths.watch, buildProcess);
	done();
};

// OUTPUT OBJECT
module.exports.phpClean = _phpClean;
module.exports.phpDev = _phpDev;
module.exports.phpProd = _phpProd;
module.exports.phpWatch = _phpWatch;
