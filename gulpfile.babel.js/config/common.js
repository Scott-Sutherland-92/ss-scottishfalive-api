"use strict";
require("dotenv").config();

const pkg = require("../../package.json");
const devMode = process.env.DEV_MODE == "true" ? true : false;

// PROJECT CONFIG
const config = {
	name: pkg.name,
	url: "http://" + pkg.proxy,
};

const deepMerge = require("../utils/deepMerge");
const buildPath = (pkg.buildPath) ? pkg.buildPath : "_build/" + config.name + "/";
const buildFolder =
	process.env.DEBUG_MODE == "true"
		? "_build/" + config.name + "/"
		: buildPath;

// OUTPUT OBJECT
module.exports = deepMerge({
	config: {
		name: config.name,
		url: config.url,
	},
	paths: {
		base: "../../public",
		src: "_src",
		build: buildFolder,
	},
});
