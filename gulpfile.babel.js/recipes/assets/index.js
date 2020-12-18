// CONSTANTS

require("dotenv").config();
const dev = process.env.DEV_MODE == "true" ? true : false;

const gulp = require("gulp");
const del = require("del");
const plumber = require("gulp-plumber");
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync");

// CONFIG
const config = require("../../config/assets");

// assets CLEAN
const _assetsClean = (done) => {
	del(config.paths.clean, { force: true }).then(function () {
		done();
	});
};

// assets DEVELOPMENT BUILD
const _assetsDev = (cb) => {
	return gulp.src(config.paths.src)
		.pipe(
			imagemin([
				imagemin.gifsicle({ interlaced: true }),
				imagemin.mozjpeg({ quality: 75, progressive: true }),
				imagemin.optipng({ optimizationLevel: 2 }),
				imagemin.svgo({
					plugins: [
						// { removeViewBox: true },
						// { cleanupIDs: false },
						// { inlineStyles: false },
						// { reusePaths: true },
					],
				}),
			])
		)
		.pipe(gulp.dest(config.paths.dest))
		.pipe(browserSync.reload({ stream: true }));
	// cb();
};

// assets PRODUCTION BUILD
const _assetsProd = (cb) => {
	return gulp.src(config.paths.src)
		.pipe(
			imagemin([
				imagemin.gifsicle({ interlaced: true }),
				imagemin.mozjpeg({ quality: 75, progressive: true }),
				imagemin.optipng({ optimizationLevel: 2 }),
				imagemin.svgo({
					plugins: [
						// { removeViewBox: true },
						// { cleanupIDs: false },
						// { inlineStyles: false },
						// { reusePaths: true },
					],
				}),
			])
		)
		.pipe(gulp.dest(config.paths.dest))
		.pipe(browserSync.reload({ stream: true }));
	// cb();
};

// assets WATCH
const _assetsWatch = (done) => {
	let buildProcess = dev ? _assetsDev : _assetsProd;

	gulp.watch(config.paths.watch, buildProcess);
	done();
};

// OUTPUT OBJECT
module.exports.assetsClean = _assetsClean;
module.exports.assetsDev = _assetsDev;
module.exports.assetsProd = _assetsProd;
module.exports.assetsWatch = _assetsWatch;
