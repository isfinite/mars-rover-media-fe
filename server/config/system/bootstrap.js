'use strict';

var express = require('express')
	, appPath = process.cwd();

module.exports = function() {

	function bootstrapModels() {
		require('../util')
			.walk(appPath + '/server/models', null, function(path) {
				require(path);
			});
	}

	// bootstrapModels();

	var app = express();
	require(appPath + '/server/config/express')(app);

	return app;

}