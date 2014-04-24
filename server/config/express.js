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

	app.use('/public', express.static(config.root + '/public'));

	var partials = config.root + '/server/views/includes/';
	fs.readdirSync(partials).forEach(function(file) {
	    var source = fs.readFileSync(partials + file, 'utf8')
	        , partial = /(.+)\.html/.exec(file).pop();

	    handlebars.registerPartial(partial, source);
	});

	app.get('/assets/css/aggregated.css', function(req, res) {
		res.setHeader('content-type', 'text/css');
		res.send(fs.readFileSync(config.root + '/assets/build/css/aggregated.css', 'utf8'));
	});

	app.get('/assets/js/aggregated.js', function(req, res) {
		res.setHeader('content-type', 'text/javascript');
		res.send(fs.readFileSync(config.root + '/assets/build/js/aggregated.js', 'utf8'));
	});

	function bootstrapRoutes() {
		require('./util')
			.walk(appPath + '/server/routes', null, function(path) {				
				require(path)(app);
			});
	}

	bootstrapRoutes();

}