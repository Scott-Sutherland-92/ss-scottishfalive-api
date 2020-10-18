"use strict";
require('dotenv').config();

const pkg = require("./package.json");
const devMode = ( process.env.DEV_MODE == "true" ) ? true : false;

const { task, watch, parallel, series, src, dest } = require("gulp");

// Project Config
const config = {
  name: pkg.name,
  url: "http://" + pkg.proxy,
};

// Directories
const buildFolder = ( process.env.DEBUG_MODE == "true" ) ? "_build/" + config.name + "/" : "../../public/wp-content/plugins/" + config.name + "/";
const dir = {
  base: "../../public",
  src: "./_src/",
  build: buildFolder,
  // plugin      : ''
};

/**
 * GULP Constants
 *
 */
const del = require("del");
const newer = require("gulp-newer");
const sourcemaps = require("gulp-sourcemaps");

const imagemin = require("gulp-imagemin");

const sass = require("gulp-sass");
const postcss = require("gulp-postcss");

const babel = require("gulp-babel");
const webpack = require("webpack-stream");

const browserSync = require("browser-sync").create();

/**
 * PHP Constants & Tasks
 *
 */
const php = {
  src: dir.src + "_template/**/*.php",
  build: dir.build,
};

task("php", () => {
  return src([php.src])
    .pipe(newer(php.build))
    .pipe(dest(php.build))
    .pipe(browserSync.stream());
});

/**
 * Image Assets Constants & Tasks
 *
 */
const assets = {
  src: dir.src + "_assets/**/*",
  build: dir.build + "_assets/",
};

task("assets", () => {
  return src(assets.src)
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 100, progressive: true }),
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
    .pipe(dest(assets.build));
});

/**
 * Style Constants & Tasks
 *
 */
const css = {
  src: dir.src + "_includes/scss/*.scss",
  watch: dir.src + "_includes/scss/**/*",
  build: dir.build,
  sassOpts: {
    outputStyle: "nested",
    imagePath: assets.build,
    precision: 3,
    errLogToConsole: true,
  },
  processors: [
    require("postcss-assets")({
      loadPaths: ["_assets/"],
      basePath: dir.build,
      baseUrl: "/wp-content/themes/" + config.name + "/",
    }),
    require("autoprefixer"),
    require("cssnano"),
  ],
};

if (devMode) {
  task("style", () => {
    return src(css.src)
      .pipe(sourcemaps.init())
      .pipe(sass(css.sassOpts))
      .pipe(postcss(css.processors))
      .pipe(sourcemaps.write("."))
      .pipe(dest(css.build))
      .pipe(browserSync.stream());
  });
} else {

  task("style", () => {
    del([dir.build + "/*.css.map"], { force: true });
    del([dir.build + "/*.css"], { force: true });
    
    return src(css.src)
      .pipe(sass(css.sassOpts))
      .pipe(postcss(css.processors))
      .pipe(dest(css.build))
      .pipe(browserSync.stream());
  });
}

/**
 * Javascript Constants & Tasks
 *
 */
const js = {
  src: dir.src + "_includes/js/**/*.{js,jsx}",
  build: dir.build + "_includes/js/",
};

task("js", () => {
  del([dir.build + "/_includes/js/**/*"], { force: true });

  return src(js.src)
    .pipe(webpack(require("./webpack.config.js")))
    .pipe(dest(js.build))
    .pipe(browserSync.stream());
});

/**
 * Watch Tasks
 *
 */
const syncOpts = {
  proxy: config.url,
  watch: true,
  port: "8787",
  open: false,
  notify: true,
  ghostMode: false,
  ui: { port: 8001 },
};

task("watch", () => {
  browserSync.init(syncOpts);
  // watch( [dir.plugin] ).on('change', browserSync.reload);
  watch([php.src], series(["php"]));
  watch([assets.src], series(["assets"]));
  watch([css.watch], series(["style"]));
  watch([js.src], series(["js"]));
});

/**
 * Runner Tasks
 *
 */
task("clean", (cb) => {
  del([dir.build + "/**/*"], { force: true });
  cb();
});

task("build", series("assets", "php", "style", "js"));
task("default", series("build", "watch"));

// task("test", (cb) => {
//   console.log(typeof devMode);
//   cb();
// })