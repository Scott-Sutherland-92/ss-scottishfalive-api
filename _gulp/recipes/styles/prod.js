const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sass = require("gulp-sass");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const notify = require("gulp-notify");

// CONFIG
var config = require("../../config/styles");

var plugins = [
	autoprefixer(config.options.autoprefixer),
	cssnano(config.options.minify),
];

module.exports = function () {
	return gulp
		.src(config.paths.src)
		.pipe(plumber())
		.pipe(sass.sync(config.options.sass).on("error", sass.logError))
		.pipe(postcss(plugins))
		.pipe(gulp.dest(config.paths.dest));
};
