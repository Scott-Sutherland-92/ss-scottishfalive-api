const del = require('del');

// config
const config = require('../../config/php');


/**
 * Delete all CSS and SourceMap
 * files within the built theme's
 * asset directory
 *
 */
module.exports = function (done) {
	del(config.paths.clean, { force: true })
		.then(function () { done(); });
};