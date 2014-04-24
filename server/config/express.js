'use strict';

var express = require('express')
	, config = require('./config')
	, cons = require('consolidate')
	, fs = require('fs')
	, handlebars = require('handlebars')
	, appPath = process.cwd();

module.exports = function(app) {

	app.engine('html', cons.handlebars);

	app.set('view engine', 'html');
	app.set('views', config.root + '/server/views');

	var partials = config.root + '/server/views/includes/';
	fs.readdirSync(partials).forEach(function(file) {
	    var source = fs.readFileSync(partials + file, 'utf8')
	        , partial = /(.+)\.html/.exec(file).pop();

	    handlebars.registerPartial(partial, source);
	});

	app.use('/public', express.static(config.root + '/public'));

	app.get('/assets/css/aggregated.css', function(req, res) {
		res.setHeader('content-type', 'text/css');
		res.send(fs.readFileSync(config.root + '/assets/build/css/aggregated.css', 'utf8'));
	});

	function bootstrapRoutes() {
		require('./util')
			.walk(appPath + '/server/routes', null, function(path) {
				require(path)(app);
			});
	}

	bootstrapRoutes();

}