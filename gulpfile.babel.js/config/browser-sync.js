// UTILS
const deepMerge = require("../utils/deepMerge");
const pkg = require("../../package.json");

const config = {
  name: pkg.name,
  url: "http://" + pkg.proxy,
};

// OUTPUT OBJECT
module.exports = deepMerge({
	proxy: config.url,
	watch: true,
	port: "8787",
	open: false,
	notify: true,
	ghostMode: false,
	ui: { port: 8001 },
});
