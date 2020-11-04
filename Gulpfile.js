"use strict";
require("dotenv").config();

const pkg = require("./package.json");
const themeName = pkg.name;
const dev = process.env.DEV_MODE == "true" ? true : false;

const { task, watch, parallel, series, src, dest } = require("gulp");

// REQUIREMENTS & CONSTANT SETUP
const log = require("fancy-log");
const c = require("ansi-colors");

// UTILS
const lazyQuire = require("./_gulp/utils/lazyQuire");

log(c.green("Starting Gulp! Please wait..."));

// BROWSER SYNC
task("browser:sync", lazyQuire(require, "./_gulp/recipes/browser-sync"));

// PHP FILES
task("php:clean", lazyQuire(require, "./_gulp/recipes/php/clean"));
task("php:dev", series("php:clean", lazyQuire(require, "./_gulp/recipes/php/dev")));
task("php:prod", series("php:clean", lazyQuire(require, "./_gulp/recipes/php/prod")));
task("php:watch", series("php:dev", lazyQuire(require, "./_gulp/recipes/php/watch")));

// ASSETS
task("assets:clean", lazyQuire(require, "./_gulp/recipes/assets/clean"));
task("assets:dev", series("assets:clean", lazyQuire(require, "./_gulp/recipes/assets/dev")));
task("assets:prod", series("assets:clean", lazyQuire(require, "./_gulp/recipes/assets/prod")));
task("assets:watch", series("assets:dev", lazyQuire(require, "./_gulp/recipes/assets/watch")));

// SCRIPTS
task("scripts:clean", lazyQuire(require, "./_gulp/recipes/scripts/clean"));
task("scripts:dev", series("scripts:clean", lazyQuire(require, "./_gulp/recipes/scripts/dev")));
task("scripts:prod", series("scripts:clean", lazyQuire(require, "./_gulp/recipes/scripts/prod")));
task("scripts:watch", series("scripts:dev", lazyQuire(require, "./_gulp/recipes/scripts/watch")));

// STYLES
task("styles:clean", lazyQuire(require, "./_gulp/recipes/styles/clean"));
task("styles:dev", series("styles:clean", lazyQuire(require, "./_gulp/recipes/styles/dev")));
task("styles:prod", series("styles:clean", lazyQuire(require, "./_gulp/recipes/styles/prod")));
task("styles:watch", series("styles:dev", lazyQuire(require, "./_gulp/recipes/styles/watch")));

// PROJECT
task("project:clean", lazyQuire(require, "./_gulp/recipes/project/clean"));

// TEST TASKS
task("test", (cb) => {
	log(c.green("Gulp Test Mode"));
	cb();
});

// GROUPED TASKS
task(
	"default",
	series(
		parallel("php:watch","assets:watch","scripts:watch","styles:watch"),
		"browser:sync",
	)
);

if (dev) {
	task("build", parallel("php:dev", "assets:dev", "scripts:dev", "styles:dev"));
} else {
	task("build", parallel("php:prod", "assets:prod", "scripts:prod", "styles:prod"));
}

task("clean", parallel("project:clean"));
task("build:dev", parallel("php:dev", "assets:dev", "scripts:dev", "styles:dev"));
task("build:prod", parallel("php:prod", "assets:prod", "scripts:prod", "styles:prod"));