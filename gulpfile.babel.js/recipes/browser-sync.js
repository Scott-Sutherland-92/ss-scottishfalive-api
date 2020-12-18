var browserSync = require("browser-sync");

// config
var config = require("../config/browser-sync");

// OUTPUT OBJECT
module.exports.browserSync = (done) => {
	browserSync(config);
	done();
};
