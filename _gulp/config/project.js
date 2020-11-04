// UTILS
const deepMerge = require("../utils/deepMerge");

// CONFIG
const paths = require("./common").paths;

// OUTPUT OBJECT
module.exports = deepMerge({
	paths: {
		clean: [paths.build + "/**/*"],
	},
});
