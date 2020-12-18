// UTILS
const deepMerge = require("../utils/deepMerge");

// CONFIG
const paths = require("./common").paths;

// OUTPUT OBJECT
module.exports = deepMerge({
	paths: {
		watch: [paths.src + "/_includes/libraries/**/*"],
		src: [paths.src + "/_includes/libraries/**/*"],
		dest: paths.build + "/_libraries/",
		clean: [paths.build + "/_libraries/**/*"],
	},
});
