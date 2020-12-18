const del = require("del");

// config
const config = require("../../config/project");

// OUTPUT OBJECT
module.exports.projectClean = (done) => {
	del(config.paths.clean, { force: true }).then(function () {
		done();
	});
};
