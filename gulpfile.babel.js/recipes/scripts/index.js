// CONSTANTS

require("dotenv").config();
const dev = process.env.DEV_MODE == "true" ? true : false;

const gulp = require("gulp");
const del = require("del");
const plumber = require("gulp-plumber");
const named = require("vinyl-named");
const webpack = require("webpack");
const gulpWebpack = require("webpack-stream");
const browserSync = require("browser-sync");

// UTILS
const deepMerge = require("../../utils/deepMerge");
const logStats = require("../../utils/webpackLogStats");

// CONFIG
const config = require("../../config/scripts");

// SCRIPTS CLEAN
const _scriptsClean = (done) => {
	del(config.paths.clean, { force: true }).then(function () {
		done();
	});
};

// SCRIPTS DEVELOPMENT BUILD
const _scriptsDev = (cb) => {
	return gulp.src(config.paths.src)
		.pipe(plumber())
		.pipe(named())
		.pipe(
			gulpWebpack(
				deepMerge(
					config.options.webpack.defaults,
					config.options.webpack.dev
				),
				webpack,
				function (err, stats) {
					logStats(err, stats);
					browserSync.reload();
				}
			)
		)
		.pipe(gulp.dest(config.paths.dest));
};

// SCRIPTS PRODUCTION BUILD
const _scriptsProd = (cb) => {
	return gulp.src(config.paths.src)
		.pipe(plumber())
		.pipe(named())
		.pipe(
			gulpWebpack(
				deepMerge(
					config.options.webpack.defaults,
					config.options.webpack.prod
				),
				webpack,
				function (err, stats) {
					logStats(err, stats);
					// reload browser-sync when a package is updated
					browserSync.reload();
					// notifaker(pumped('JS Packaged'));
				}
			)
		)
		.pipe(gulp.dest(config.paths.dest));
};

// SCRIPTS WATCH
const _scriptsWatch = (done) => {
	let buildProcess = dev ? _scriptsDev : _scriptsProd;

	gulp.watch(config.paths.watch, gulp.series(_scriptsClean, buildProcess));
	done();
};

// OUTPUT OBJECT
module.exports.scriptsClean = _scriptsClean;
module.exports.scriptsDev = _scriptsDev;
module.exports.scriptsProd = _scriptsProd;
module.exports.scriptsWatch = _scriptsWatch;