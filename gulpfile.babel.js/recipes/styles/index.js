// CONSTANTS

require("dotenv").config();
const dev = process.env.DEV_MODE == "true" ? true : false;

const gulp = require("gulp");
const del = require("del");
const plumber = require("gulp-plumber");
const sass = require("gulp-sass");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const filter = require("gulp-filter");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync");
const c = require("ansi-colors");
const log = require("fancy-log");

// CONFIG
const config = require("../../config/styles");

let plugins = [
	autoprefixer(config.options.autoprefixer),
	cssnano(config.options.minify),
];

// STYLES CLEAN
const _stylesClean = (done) => {
	del(config.paths.clean, { force: true }).then(function () {
		done();
	});
};

// STYLES DEVELOPMENT BUILD
const _stylesDev = (cb) => {
	let filterCSS = filter("**/*.css", { restore: true });

	return gulp
		.src(config.paths.src)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass.sync(config.options.sass))
		.on("error", function (error) {
			log(c.red(error.message));
			this.emit("end");
		})
		.pipe(postcss(plugins))
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest(config.paths.dest))
		.pipe(filterCSS)
		.pipe(browserSync.reload({ stream: true }))
		.pipe(filterCSS.restore);
};

// STYLES PRODUCTION BUILD
const _stylesProd = (cb) => {
	return gulp
		.src(config.paths.src)
		.pipe(plumber())
		.pipe(sass.sync(config.options.sass).on("error", sass.logError))
		.pipe(postcss(plugins))
		.pipe(gulp.dest(config.paths.dest))
		.pipe(browserSync.reload({ stream: true }));
};

// STYLES WATCH
const _stylesWatch = (done) => {
	let buildProcess = dev ? _stylesDev : _stylesProd;

	gulp.watch(config.paths.watch, buildProcess);
	done();
};

// OUTPUT OBJECT
module.exports.stylesClean = _stylesClean;
module.exports.stylesDev = _stylesDev;
module.exports.stylesProd = _stylesProd;
module.exports.stylesWatch = _stylesWatch;
