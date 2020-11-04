const gulp = require("gulp");
const filter = require("gulp-filter");
const plumber = require("gulp-plumber");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const notify = require("gulp-notify");
const browserSync = require("browser-sync");
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
const c = require("ansi-colors");
const log = require("fancy-log");

// CONFIG
const config = require("../../config/styles");

// POST CSS
const plugins = [autoprefixer(config.options.autoprefixer)];

module.exports = function (cb) {
	let filterCSS = filter("**/*.css", { restore: true });

	return gulp
		.src(config.paths.src)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass.sync(config.options.sass))
		.on("error", function (error) {
			log(c.red(error.message))
			this.emit("end");
		})
		.pipe(postcss(plugins))
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest(config.paths.dest))
		.pipe(filterCSS)
		.pipe(browserSync.reload({ stream: true }))
		.pipe(filterCSS.restore);
};
