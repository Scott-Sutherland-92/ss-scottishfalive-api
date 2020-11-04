// UTILS
const deepMerge = require("../utils/deepMerge");

// CONFIG
const paths = require("./common").paths;

// OUTPUT OBJECT
module.exports = deepMerge({
	paths: {
		watch: [
			paths.src + "/_template/**/*.php",
		],
		src: [
			paths.src + "/_template/**/*.php",
		],
		dest: paths.build,
		clean: [
			paths.build + "/**/*.php",
		],
	},
});
