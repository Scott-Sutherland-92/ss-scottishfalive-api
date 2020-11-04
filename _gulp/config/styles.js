// UTILS
const deepMerge = require("../utils/deepMerge");

// CONFIG
const paths = require("./common").paths;

// OUTPUT OBJECT
module.exports = deepMerge({
	paths: {
		watch: [
			paths.src + "/_includes/scss/**/*.scss",
			"!" + paths.src + "/_includes/scss/**/*_tmp\\d+.scss",
		],
		src: [
			paths.src + "/_includes/scss/*.scss",
			"!" + paths.src + "/_includes/scss/**/_*",
		],
		dest: paths.build,
		clean: paths.build + "/*.{css,map}",
	},

	options: {
		sass: {},
		autoprefixer: {
			overrideBrowserslist: ["last 2 version", "ie >= 11", "IOS >= 7"],
		},
		minify: {
			preset: [
				"default",
				{
					discardComments: { removeAll: true },
				},
			],
		},
	},
});
