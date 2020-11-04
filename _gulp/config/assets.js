// UTILS
const deepMerge = require("../utils/deepMerge");

// CONFIG
const paths = require("./common").paths;

// OUTPUT OBJECT
module.exports = deepMerge({
	paths: {
		watch: [paths.src + "/_assets/**/*"],
		src: [paths.src + "/_assets/**/*"],
		dest: paths.build + "/_assets",
		clean: [paths.build + "/_assets/**/*"],
	},
});
