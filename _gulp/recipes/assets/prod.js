const gulp = require("gulp");
const plumber = require("gulp-plumber");
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync");

// CONFIG
const config = require("../../config/assets");

module.exports = function (cb) {
	return gulp
		.src(config.paths.src)
		.pipe(
			imagemin([
				imagemin.gifsicle({ interlaced: true }),
				imagemin.mozjpeg({ quality: 75, progressive: true }),
				imagemin.optipng({ optimizationLevel: 5 }),
				imagemin.svgo({
					plugins: [
						{ removeViewBox: true },
						{ cleanupIDs: false },
						{ inlineStyles: false },
						{ reusePaths: true },
					],
				}),
			])
		)
		.pipe(gulp.dest(config.paths.dest))
		.pipe(browserSync.reload({ stream: true }));
};
