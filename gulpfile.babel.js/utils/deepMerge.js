let lodash = require("lodash");

// DEEPMERGE TWO OBJECTS
module.exports = function (a, b) {
	return lodash.mergeWith(a, b, deep);
};

// DEEPMERGE ARRAYS
function deep(a, b) {
	if (lodash.isArray(a) && lodash.isArray(b)) {
		return a.concat(b);
	}
}
