"use strict";
require("dotenv").config();

const pkg = require("../package.json");
const themeName = pkg.name;
const dev = process.env.DEV_MODE == "true" ? true : false;

const { task, watch, parallel, series, src, dest } = require("gulp");

// REQUIREMENTS & CONSTANT SETUP
const log = require("fancy-log");
const c = require("ansi-colors");

// UTILS
const lazyQuire = require("./utils/lazyQuire");

log(c.green("Starting Gulp! Please wait..."));

// BROWSER SYNC
import { browserSync } from "./recipes/browser-sync";
task("browser:sync", browserSync);

// PHP FILES
import { phpClean, phpDev, phpProd, phpWatch } from "./recipes/php";
task("php:clean", phpClean);
task("php:dev", series(phpClean, phpDev));
task("php:prod", series(phpClean, phpProd));
task("php:watch", series(phpWatch));

// LIBRARIES FILES
import {
	librariesClean,
	librariesBuild,
	librariesWatch,
} from "./recipes/libraries";
task("libraries:clean", librariesClean);
task("libraries:build", series(librariesClean, librariesBuild));
task("libraries:watch", series(librariesWatch));

// ASSETS
import {
	assetsClean,
	assetsDev,
	assetsProd,
	assetsWatch,
} from "./recipes/assets";
task("assets:clean", assetsClean);
task("assets:dev", series(assetsClean, assetsDev));
task("assets:prod", series(assetsClean, assetsProd));
task("assets:watch", series(assetsWatch));

// // SCRIPTS
import {
	scriptsClean,
	scriptsDev,
	scriptsProd,
	scriptsWatch,
} from "./recipes/scripts";
task("scripts:clean", scriptsClean);
task("scripts:dev", series(scriptsClean, scriptsDev));
task("scripts:prod", series(scriptsClean, scriptsProd));
task("scripts:watch", series(scriptsWatch));

// STYLES
import {
	stylesClean,
	stylesDev,
	stylesProd,
	stylesWatch,
} from "./recipes/styles";
task("styles:clean", stylesClean);
task("styles:dev", series(stylesClean, stylesDev));
task("styles:prod", series(stylesClean, stylesProd));
task("styles:watch", series(stylesWatch));

// PROJECT
import { projectClean } from "./recipes/project";
task("clean", projectClean);

// GROUPED TASKS
task(
	"build:dev",
	parallel(
		"php:dev",
		"libraries:build",
		"assets:dev",
		"scripts:dev",
		"styles:dev"
	)
);
task(
	"build:prod",
	parallel(
		"php:prod",
		"libraries:build",
		"assets:prod",
		"scripts:prod",
		"styles:prod"
	)
);

const buildProcess = dev ? "build:dev" : "build:prod";
task("build", series(buildProcess));

exports.default = series(
	"build",
	parallel(
		"php:watch",
		"libraries:watch",
		"assets:watch",
		"scripts:watch",
		"styles:watch"
	),
	"browser:sync"
);
