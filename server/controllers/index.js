var request = require('request')
	, appPath = process.cwd();

exports.render = function(req, res) {

	var obj = { title: 'Home' }

	require(appPath + '/server/config/util.js').exists(appPath + '/public/controllers/index.js', function(exists) {
		if (exists) obj.module = 'index';
		res.render('index', obj);
	});

}